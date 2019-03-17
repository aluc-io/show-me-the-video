"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wasProcessed = wasProcessed;
exports.noRewire = noRewire;
exports.contains = contains;
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

function wasProcessed(path) {
  return path.node.__noRewire === true;
}

function noRewire(identifier) {
  identifier.__noRewire = true;
  return identifier;
}

function contains(array, needle) {
  var contains = false;
  for (var i = 0; i < array.length; ++i) {
    contains = contains || array[i] == needle;
  }
  return contains;
}