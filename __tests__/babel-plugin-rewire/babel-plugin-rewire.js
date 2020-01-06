'use strict';

var _RewireState = require('./RewireState.js');

var _RewireState2 = _interopRequireDefault(_RewireState);

var _RewireHelpers = require('./RewireHelpers.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*Copyright (c) 2015, Robert Binna <r.binna@synedra.com>

 Permission to use, copy, modify, and/or distribute this software for any
 purpose with or without fee is hereby granted, provided that the above
 copyright notice and this permission notice appear in all copies.

 THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.*/

module.exports = function (_ref) {
	var t = _ref.types,
	    template = _ref.template;

	function isRewireable(path, variableBinding) {
		var node = path.node,
		    parent = path.parent;


		return variableBinding.referencePaths !== null && !(parent.type === 'VariableDeclarator' && parent.id == node) && !(parent.type === 'ForInStatement' && parent.left == node) && !(parent.type === 'FunctionExpression' && parent.id === node) && !(parent.type === 'MemberExpression' && parent.property === node) && !(parent.type === 'ObjectProperty' && parent.key === node) && !(parent.type === 'RestProperty') && !(parent.type === 'ObjectMethod' && parent.key === node) && !(parent.type === 'ObjectProperty' && path.parentPath && path.parentPath.parent && path.parentPath.parent.type === 'ObjectPattern') && !(parent.type === 'ExportSpecifier') && !(parent.type === 'ImportSpecifier') && !(parent.type === 'ObjectTypeProperty') && 		!(parent.type === 'ClassMethod') &&
		!(parent.type === 'TSTypeReference') &&
		!(parent.type === 'TSTypeQuery') &&
		!(parent.type === 'TSQualifiedName')

	}

	function doesIdentifierRepresentAValidReference(path, variableBinding, rewireInformation) {
		var isIgnoredVariable = rewireInformation.ignoredIdentifiers.indexOf(path.node.name) !== -1;
		return !isIgnoredVariable && variableBinding !== undefined && !(0, _RewireHelpers.wasProcessed)(path) && variableBinding.scope.block.type === 'Program';
	}

	function getVariableNameAndBinding(path) {
		var node = path.node,
		    parent = path.parent,
		    scope = path.scope;

		var variableName = node.name;
		var variableBinding = !t.isFlow || !t.isFlow(node) && !t.isFlow(parent) ? scope.getBinding(variableName) : undefined;

		return {
			variableName: variableName,
			variableBinding: variableBinding
		};
	}

	var BodyVisitor = {
		Identifier: function Identifier(path, rewireInformation) {
			var node = path.node,
			    parent = path.parent,
			    scope = path.scope;

			var _getVariableNameAndBi = getVariableNameAndBinding(path),
			    variableName = _getVariableNameAndBi.variableName,
			    variableBinding = _getVariableNameAndBi.variableBinding;

			//Matches for body


			if (doesIdentifierRepresentAValidReference(path, variableBinding, rewireInformation)) {
				var isWildCardImport = variableBinding.path.type === 'ImportNamespaceSpecifier';
				if (isRewireable(path, variableBinding) && (0, _RewireHelpers.contains)(variableBinding.referencePaths, path)) {
					if (parent.type === 'UpdateExpression') {
						rewireInformation.addUpdateableVariable(variableName);
						path.parentPath.replaceWith(t.callExpression(rewireInformation.getUpdateOperationID(), [t.stringLiteral(parent.operator), t.stringLiteral(variableName), t.booleanLiteral(parent.prefix)]));
					} else {
						rewireInformation.ensureAccessor(variableName, isWildCardImport);
						path.replaceWith(t.callExpression(rewireInformation.getUniversalGetterID(), [t.stringLiteral(variableName)]));
					}
				} else if (parent.type === 'AssignmentExpression' && parent.left == node) {
					rewireInformation.addUpdateableVariable(variableName);

					if (parent.operator === '=') {
						path.parentPath.replaceWith((0, _RewireHelpers.noRewire)(t.callExpression(rewireInformation.getAssignmentOperationID(), [t.stringLiteral(variableName), parent.right])));
					} else {
						var baseOperator = parent.operator.substring(0, parent.operator.length - 1);
						path.parentPath.replaceWith(t.assignmentExpression('=', parent.left, t.binaryExpression(baseOperator, t.callExpression(rewireInformation.getUniversalGetterID(), [t.stringLiteral(variableName)]), parent.right)));
					}
					//TODO variable bindings add accessor for each variable declaration even if its unused. The reason is that any other plugin could potentially change the code otherwise
				}

				if (variableBinding.identifier === node) {
					rewireInformation.addTrackedIdentifier(variableName, isWildCardImport);
				}
			}
		},

		'ExportNamedDeclaration|ExportAllDeclaration': function ExportNamedDeclarationExportAllDeclaration(_ref2, rewireInformation) {
			var _ref2$node$specifiers = _ref2.node.specifiers,
			    specifiers = _ref2$node$specifiers === undefined ? [] : _ref2$node$specifiers;

			var hasDefaultExport = specifiers.some(function (specifier) {
				return specifier.local && specifier.local.name === 'default' || specifier.exported && specifier.exported.name === 'default';
			});
			rewireInformation.hasES6DefaultExport = rewireInformation.hasES6DefaultExport || hasDefaultExport;
			rewireInformation.isES6Module = true;
		},

		AssignmentExpression: function AssignmentExpression(_ref3, rewireInformation) {
			var assignmentExpression = _ref3.node,
			    blockType = _ref3.scope.block.type;

			rewireInformation.hasCommonJSExport = blockType === 'Program' && !!assignmentExpression.left.object && assignmentExpression.left.object.name === 'module' && !!assignmentExpression.left.property && assignmentExpression.left.property.name === 'exports';
		},

		ExportDefaultDeclaration: function ExportDefaultDeclaration(path, rewireInformation) {
			if (!(0, _RewireHelpers.wasProcessed)(path)) {
				(function () {
					var exportIdentifier = null;
					rewireInformation.hasES6DefaultExport = true;
					rewireInformation.hasES6Export = true;
					rewireInformation.isES6Module = true;

					var declarationVisitors = {
						ClassDeclaration: function ClassDeclaration(path, rewireInformation) {
							var existingClassDeclaration = path.node,
							    parent = path.parent,
							    scope = path.scope;

							if (existingClassDeclaration.id === null && parent.type === 'ExportDefaultDeclaration') {
								exportIdentifier = scope.generateUidIdentifier("DefaultExportValue");
								path.replaceWith(t.classDeclaration(exportIdentifier, existingClassDeclaration.superClass, existingClassDeclaration.body, existingClassDeclaration.decorators || []));
							} else {
								exportIdentifier = existingClassDeclaration.id;
							}
						},
						FunctionDeclaration: function FunctionDeclaration(path, rewireInformation) {
							var existingFunctionDeclaration = path.node,
							    scope = path.scope;

							if (existingFunctionDeclaration.id === null && path.parent.type === 'ExportDefaultDeclaration') {
								exportIdentifier = scope.generateUidIdentifier("DefaultExportValue");
								path.replaceWith(t.functionDeclaration(exportIdentifier, existingFunctionDeclaration.params, existingFunctionDeclaration.body, existingFunctionDeclaration.generator, existingFunctionDeclaration.async));
							} else if (path.parent.type === 'ExportDefaultDeclaration') {
								exportIdentifier = existingFunctionDeclaration.id;
							}
						},
						Identifier: function Identifier(_ref4, rewireInformation) {
							var parentType = _ref4.parent.type,
							    identifier = _ref4.node;

							if (parentType === 'ExportDefaultDeclaration') {
								exportIdentifier = identifier;
							}
						}
					};

					path.traverse(declarationVisitors, rewireInformation);
					if (exportIdentifier === null) {
						exportIdentifier = (0, _RewireHelpers.noRewire)(path.scope.generateUidIdentifier("DefaultExportValue"));
						path.replaceWithMultiple([t.variableDeclaration('let', [t.variableDeclarator(exportIdentifier, path.node.declaration)]), (0, _RewireHelpers.noRewire)(t.exportDefaultDeclaration(exportIdentifier))]);
					}
					rewireInformation.enrichExport(exportIdentifier);
				})();
			}
		},

		ImportDeclaration: function ImportDeclaration(path, rewireInformation) {
			rewireInformation.isES6Module = true;
		}
	};

	var BodySecondPassVisitor = {
		Identifier: function Identifier(path, rewireInformation) {
			var node = path.node,
			    parent = path.parent;

			var _getVariableNameAndBi2 = getVariableNameAndBinding(path),
			    variableName = _getVariableNameAndBi2.variableName,
			    variableBinding = _getVariableNameAndBi2.variableBinding;

			//Matches for body


			if (doesIdentifierRepresentAValidReference(path, variableBinding, rewireInformation) && isRewireable(path, variableBinding) && rewireInformation.hasTrackedIdentifier(variableName) && variableBinding.identifier !== node && parent.type !== 'UpdateExpression') {
				var isWildCardImport = variableBinding.path.type === 'ImportNamespaceSpecifier';
				rewireInformation.ensureAccessor(variableName, isWildCardImport);
				path.replaceWith(t.callExpression(rewireInformation.getUniversalGetterID(), [t.stringLiteral(variableName)]));
			}
		}
	};

	var ProgramVisitor = {
		Program: {
			enter: function enter(path, state) {
				if (!(0, _RewireHelpers.wasProcessed)(path)) {
					var rewireState = new _RewireState2.default(path.scope, t, template);
					rewireState.setIgnoredIdentifiers(state.opts.ignoredIdentifiers);

					path.traverse(BodyVisitor, rewireState);

					state.rewireState = rewireState;
				}
			},
			exit: function exit(path, state) {
				if (!(0, _RewireHelpers.wasProcessed)(path)) {
					var scope = path.scope,
					    program = path.node;

					var rewireState = state.rewireState;
					path.traverse(BodySecondPassVisitor, rewireState);
					if (rewireState.containsDependenciesToRewire()) {
						rewireState.prependUniversalAccessors(scope);
						rewireState.appendExports();

						path.pushContainer("body", rewireState.nodesToAppendToProgramBody);
					}
				}
			}
		}
	};

	return {
		visitor: ProgramVisitor
	};
};
