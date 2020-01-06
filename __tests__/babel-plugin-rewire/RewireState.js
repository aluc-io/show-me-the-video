'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*Copyright (c) 2015, Robert Binna <r.binna@synedra.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Permission to use, copy, modify, and/or distribute this software for any
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      purpose with or without fee is hereby granted, provided that the above
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      copyright notice and this permission notice appear in all copies.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.*/

var _Templates = require('./Templates.js');

var _Templates2 = _interopRequireDefault(_Templates);

var _RewireHelpers = require('./RewireHelpers.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var t;
var universalAccesorsTemplate;
var enrichExportTemplate;
var filterWildcardImportTemplate;

var RewireState = function () {
	function RewireState(scope, types, template) {
		_classCallCheck(this, RewireState);

		t = types;
		var templates = (0, _Templates2.default)(template);
		universalAccesorsTemplate = templates.universalAccesorsTemplate;
		enrichExportTemplate = templates.enrichExportTemplate;
		filterWildcardImportTemplate = templates.filterWildcardImportTemplate;
		this.isES6Module = false;
		this.hasES6Export = false;
		this.hasES6DefaultExport = false;
		this.nodesToAppendToProgramBody = [];
		this.hasCommonJSExport = false;
		this.accessors = {};
		this.trackedIdentfiers = {};
		this.isWildcardImport = {};
		this.ignoredIdentifiers = [];
		this.updateableVariables = {};
		this.getGlobalVariableHandleIdentifier = scope.generateUidIdentifier('getGlobalObject');
		this.getRewiredDataIdentifier = scope.generateUidIdentifier('__getRewiredData__');
		this.getRewireRegistryIdentifier = scope.generateUidIdentifier('__getRewireRegistry__');
		this.getUniqueGlobalModuleIdIdentifier = scope.generateUidIdentifier('__getRewireModuleId__');
		this.uniqueModuleIdIdentifier = scope.generateUidIdentifier('__RewireModuleId__');
		this.originalVariableAccessorIdentifier = scope.generateUidIdentifier('__get_original__');
		this.originalVariableSetterIdentifier = scope.generateUidIdentifier('__set_original__');
		this.updateOperationIdentifier = scope.generateUidIdentifier('__update_operation__');
		this.assignmentOperationIdentifier = scope.generateUidIdentifier('__assign__');
		this.typeofOriginalExportVariable = scope.generateUidIdentifier('typeOfOriginalExport');

		this.universalAccessors = {
			__get__: (0, _RewireHelpers.noRewire)(scope.generateUidIdentifier('__get__')),
			__set__: (0, _RewireHelpers.noRewire)(scope.generateUidIdentifier('__set__')),
			__reset__: (0, _RewireHelpers.noRewire)(scope.generateUidIdentifier('__reset__')),
			__with__: (0, _RewireHelpers.noRewire)(scope.generateUidIdentifier('__with__')),
			__RewireAPI__: (0, _RewireHelpers.noRewire)(scope.generateUidIdentifier('__RewireAPI__')),
			__assignOperation: (0, _RewireHelpers.noRewire)(scope.generateUidIdentifier('__assign__'))
		};
	}

	_createClass(RewireState, [{
		key: 'appendToProgramBody',
		value: function appendToProgramBody(nodes) {
			if (!Array.isArray(nodes)) {
				nodes = [nodes];
			}
			this.nodesToAppendToProgramBody = this.nodesToAppendToProgramBody.concat(nodes);
		}
	}, {
		key: 'prependToProgramBody',
		value: function prependToProgramBody(nodes) {
			if (!Array.isArray(nodes)) {
				nodes = [nodes];
			}
			this.nodesToAppendToProgramBody = nodes.concat(this.nodesToAppendToProgramBody);
		}
	}, {
		key: 'ensureAccessor',
		value: function ensureAccessor(variableName) {
			var isWildcardImport = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (!this.accessors[variableName]) {
				this.accessors[variableName] = true;
				this.addTrackedIdentifier(variableName, isWildcardImport);
			}

			return this.accessors[variableName];
		}
	}, {
		key: 'addTrackedIdentifier',
		value: function addTrackedIdentifier(variableName) {
			var isWildcardImport = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.isWildcardImport[variableName] = isWildcardImport;
			return this.trackedIdentfiers[variableName] = true;
		}
	}, {
		key: 'hasTrackedIdentifier',
		value: function hasTrackedIdentifier(variableName) {
			return !!this.trackedIdentfiers[variableName];
		}
	}, {
		key: 'addUpdateableVariable',
		value: function addUpdateableVariable(variableName) {
			this.updateableVariables[variableName] = true;
			this.ensureAccessor(variableName);
		}
	}, {
		key: 'setIgnoredIdentifiers',
		value: function setIgnoredIdentifiers(ignoredIdentifiers) {
			this.ignoredIdentifiers = ignoredIdentifiers || [];
		}
	}, {
		key: 'prependUniversalAccessors',
		value: function prependUniversalAccessors(scope) {
			var hasWildcardImport = Object.keys(this.isWildcardImport).some(function (propertyName) {
				return this.isWildcardImport[propertyName];
			}.bind(this));
			var filterWildcardImportIdentifier = hasWildcardImport && (0, _RewireHelpers.noRewire)(scope.generateUidIdentifier('__filterWildcardImport__')) || null;

			var originalAccessor = t.functionDeclaration(this.originalVariableAccessorIdentifier, [t.identifier('variableName')], t.blockStatement([t.switchStatement(t.identifier('variableName'), Object.keys(this.accessors).map(function (identifierName) {
				var accessOriginalVariable = (0, _RewireHelpers.noRewire)(t.identifier(identifierName));

				if (this.isWildcardImport[identifierName]) {
					accessOriginalVariable = t.callExpression(filterWildcardImportIdentifier, [accessOriginalVariable]);
				}

				return t.switchCase(t.stringLiteral(identifierName), [t.returnStatement(accessOriginalVariable)]);
			}, this)), t.returnStatement((0, _RewireHelpers.noRewire)(t.identifier('undefined')))]));

			var valueVariable = scope.generateUidIdentifier('value');
			var originalSetter = t.functionDeclaration(this.originalVariableSetterIdentifier, [t.identifier('variableName'), valueVariable], t.blockStatement([t.switchStatement(t.identifier('variableName'), Object.keys(this.updateableVariables).map(function (identifierName) {
				return t.switchCase(t.stringLiteral(identifierName), [t.returnStatement(t.assignmentExpression('=', (0, _RewireHelpers.noRewire)(t.identifier(identifierName)), valueVariable))]);
			})), t.returnStatement((0, _RewireHelpers.noRewire)(t.identifier('undefined')))]));

			this.prependToProgramBody(universalAccesorsTemplate({
				ORIGINAL_VARIABLE_ACCESSOR_IDENTIFIER: this.originalVariableAccessorIdentifier,
				ORIGINAL_VARIABLE_SETTER_IDENTIFIER: this.originalVariableSetterIdentifier,
				ASSIGNMENT_OPERATION_IDENTIFIER: this.assignmentOperationIdentifier,
				UPDATE_OPERATION_IDENTIFIER: this.updateOperationIdentifier,
				ORIGINAL_ACCESSOR: originalAccessor,
				ORIGINAL_SETTER: originalSetter,
				UNIVERSAL_GETTER_ID: this.getUniversalGetterID(),
				UNIVERSAL_SETTER_ID: this.getUniversalSetterID(),
				UNIVERSAL_RESETTER_ID: this.getUniversalResetterID(),
				UNIVERSAL_WITH_ID: this.getUniversalWithID(),
				API_OBJECT_ID: this.getAPIObjectID(),
				GET_GLOBAL_VARIABLE_HANDLE_IDENTIFIER: this.getGlobalVariableHandleIdentifier,
				GET_REWIRE_DATA_IDENTIFIER: this.getRewiredDataIdentifier,
				GET_UNIQUE_GLOBAL_MODULE_ID_IDENTIFIER: this.getUniqueGlobalModuleIdIdentifier,
				GET_REWIRE_REGISTRY_IDENTIFIER: this.getRewireRegistryIdentifier,
				UNIQUE_GLOBAL_MODULE_ID_IDENTIFIER: this.uniqueModuleIdIdentifier
			}));

			if (hasWildcardImport) {
				this.appendToProgramBody(filterWildcardImportTemplate({
					FILTER_WILDCARD_IMPORT_IDENTIFIER: filterWildcardImportIdentifier
				}));
			}
		}
	}, {
		key: 'appendExports',
		value: function appendExports() {
			if (this.isES6Module && (!this.hasCommonJSExport || this.hasES6Export)) {
				this.appendToProgramBody(this.generateNamedExports());

				if (!this.hasES6DefaultExport) {
					this.appendToProgramBody(t.exportDefaultDeclaration(this.getAPIObjectID()));
				}
			} else if (!this.isES6Module || !this.hasES6Export && this.hasCommonJSExport) {
				var commonJSExport = t.memberExpression(t.identifier('module'), t.identifier('exports'), false);
				this.enrichExport(commonJSExport);
			}
		}
	}, {
		key: 'enrichExport',
		value: function enrichExport(exportValue) {
			this.appendToProgramBody(enrichExportTemplate({
				TYPEOFORIGINALEXPORTVARIABLE: this.getTypeOfOriginalExportVariable(),
				UNIVERSAL_GETTER_ID: this.getUniversalGetterID(),
				UNIVERSAL_SETTER_ID: this.getUniversalSetterID(),
				UNIVERSAL_RESETTER_ID: this.getUniversalResetterID(),
				UNIVERSAL_WITH_ID: this.getUniversalWithID(),
				API_OBJECT_ID: this.getAPIObjectID(),
				EXPORT_VALUE: exportValue
			}));
		}
	}, {
		key: 'generateNamedExports',
		value: function generateNamedExports() {
			return t.exportNamedDeclaration(null, [t.exportSpecifier(this.getUniversalGetterID(), t.identifier('__get__')), t.exportSpecifier(this.getUniversalGetterID(), t.identifier('__GetDependency__')), t.exportSpecifier(this.getUniversalSetterID(), t.identifier('__Rewire__')), t.exportSpecifier(this.getUniversalSetterID(), t.identifier('__set__')), t.exportSpecifier(this.getUniversalResetterID(), t.identifier('__ResetDependency__')), t.exportSpecifier(this.getAPIObjectID(), t.identifier('__RewireAPI__'))]);
		}
	}, {
		key: 'containsDependenciesToRewire',
		value: function containsDependenciesToRewire() {
			return Object.keys(this.accessors).length > 0 || Object.keys(this.updateableVariables).length > 0;
		}
	}, {
		key: 'getUniversalGetterID',
		value: function getUniversalGetterID() {
			return this.universalAccessors['__get__'];
		}
	}, {
		key: 'getUpdateOperationID',
		value: function getUpdateOperationID() {
			return this.updateOperationIdentifier;
		}
	}, {
		key: 'getAssignmentOperationID',
		value: function getAssignmentOperationID() {
			return this.assignmentOperationIdentifier;
		}
	}, {
		key: 'getUniversalSetterID',
		value: function getUniversalSetterID() {
			return this.universalAccessors['__set__'];
		}
	}, {
		key: 'getUniversalResetterID',
		value: function getUniversalResetterID() {
			return this.universalAccessors['__reset__'];
		}
	}, {
		key: 'getUniversalWithID',
		value: function getUniversalWithID() {
			return this.universalAccessors['__with__'];
		}
	}, {
		key: 'getAPIObjectID',
		value: function getAPIObjectID() {
			return this.universalAccessors['__RewireAPI__'];
		}
	}, {
		key: 'getTypeOfOriginalExportVariable',
		value: function getTypeOfOriginalExportVariable() {
			return this.typeofOriginalExportVariable;
		}
	}]);

	return RewireState;
}();

exports.default = RewireState;
;