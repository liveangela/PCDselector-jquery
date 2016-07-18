/*！
 * Chinese region picker for jQuery plugin - v0.0.1 - 2016-03-01
 * Three level selection Doms named Province, City and District
 * Using region data from json files via ajax requests
 * https://github.com/liveangela/PCDselector-jquery
 * Copyright (c) 2016 liveangela;
 */
var regionPicker = {
    options: {
        jsonURL: '../json',
        opNames: [], // three dom selectors
        opDoms: [],
        postcodeDom: '', // jQuery dom for Postcode if auto-fillment is needed
        cityVal: {},
        lastVal: {
            'p': 0, // province
            'c': 0, // city
            'd': 0, // district
            'pHtml': '',
            'cHtml': '',
            'dHtml': ''
        },
        defaultCode: [], // code number for defaultVal
        defaultVal: []
    },

    init: function (opNames) {
        if (opNames instanceof Array && 3 == opNames.length) {
            this.options.opNames = opNames;
            for (var i = 0; i < opNames.length; i++) {
                this.options.opDoms.push($('#' + opNames[i]));
            }
            this.options.lastVal.cHtml = this.options.opDoms[1].html();
            this.options.lastVal.dHtml = this.options.opDoms[2].html();

            this.defaultSet();
            this.bind();
        } else {
            console.error('PCDselector init failed: params need type array and count for 3');
        }
    },

    renderOptions: function (collection, index) {
        var items = '', r;
        var isSelected = (this.options.defaultVal.length > 0) ? 1 : 0;
        for (var i = 0; i < collection.length; i++) {
            var selectStr = '';
            r = collection[i];
            if (isSelected && r.n == this.options.defaultVal[index]) {
                selectStr = ' selected="selected"';
                this.options.defaultCode[index] = r.i;
            }
            items += '<option value="' + r.n + '" data-i="' + r.i + '" data-z="' + r.z + '"' + selectStr + '>' + r.n + '</option>'; // 传给后端的值是中文

            // only for district use
            if (r.c) {
                this.options.cityVal[r.i] = r.c;
            }
        }
        return items;
    },

    defaultSet: function () {
        var _target = this;
        $.ajax({
            url: _target.options.jsonURL + '/index.json',
            dataType: 'json',
            success: function (data) {
                _target.options.opDoms[0].append(_target.renderOptions(data, 0));

                if (_target.options.defaultVal.length > 0 && '' != _target.options.defaultVal[0] && '' != _target.options.defaultVal[1]) {
                    $.ajax({
                        url: _target.options.jsonURL + '/' + _target.options.defaultCode[0] + '.json',
                        dataType: 'json',
                        success: function (data) {
                            _target.options.opDoms[1].html(_target.options.lastVal.cHtml + _target.renderOptions(data, 1)).removeAttr('disabled');
                            if (undefined != _target.options.defaultCode[1]) {
                                var _districts = _target.options.cityVal && _target.options.cityVal[_target.options.defaultCode[1]];
                                if (_districts && _districts.length > 0) {
                                    _target.options.opDoms[2].html(_target.options.lastVal.dHtml + _target.renderOptions(_districts, 2)).removeAttr('disabled');
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus) {
                            console.log(textStatus);
                        }
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus) {
                console.log(textStatus);
                console.error('Request Province failed, please reload this page');
            }
        });
    },
    
    bind: function () {
        var rpObj = this;
        $('#' + rpObj.options.opNames.join(',#')).on('change', function () {
            var _this = $(this);
            var _value = _this.find('option:selected').attr('data-i') || 0;
            var _zipcode = _this.find('option:selected').attr('data-z') || '';
            var _id = _this.attr('id');

            if (0 != _value) {
                if (rpObj.options.opNames[0] == _id && rpObj.options.lastVal.p != _value) {
                    $.ajax({
                        url: rpObj.options.jsonURL + '/' + _value + '.json',
                        dataType: 'json',
                        success: function (data) {
                            rpObj.options.lastVal.p = _value;
                            rpObj.options.opDoms[1].html(rpObj.options.lastVal.cHtml + rpObj.renderOptions(data, 1)).removeAttr('disabled');
                            rpObj.options.opDoms[2].html(rpObj.options.lastVal.dHtml).attr('disabled', 'disabled');
                        },
                        error: function (XMLHttpRequest, textStatus) {
                            console.log(textStatus);
                            console.error('Request Province failed, please reload this page');
                        }
                    });
                    rpObj.options.postcodeDom.val('');
                } else if (rpObj.options.opNames[1] == _id && rpObj.options.lastVal.c != _value) {
                    var _districts = rpObj.options.cityVal && rpObj.options.cityVal[_value];
                    if (_districts && _districts.length > 0) {
                        rpObj.options.postcodeDom.val('');
                        rpObj.options.opDoms[2].html(rpObj.options.lastVal.dHtml + rpObj.renderOptions(_districts, 2)).removeAttr('disabled');
                    } else {
                        rpObj.options.opDoms[2].html(rpObj.options.lastVal.dHtml).attr('disabled', 'disabled');
                        '' != rpObj.options.postcodeDom && rpObj.options.postcodeDom.val(_zipcode);
                    }
                } else if (rpObj.options.opNames[2] == _id && rpObj.options.lastVal.d != _value) {
                    '' != rpObj.options.postcodeDom && rpObj.options.postcodeDom.val(_zipcode);
                }
            } else {
                rpObj.options.postcodeDom.val('');
                if (rpObj.options.opNames[1] == _id) {
                    rpObj.options.opDoms[2].html(rpObj.options.lastVal.dHtml).attr('disabled', 'disabled');
                } else if (rpObj.options.opNames[0] == _id) {
                    rpObj.options.opDoms[1].html(rpObj.options.lastVal.cHtml).attr('disabled', 'disabled');
                    rpObj.options.opDoms[2].html(rpObj.options.lastVal.dHtml).attr('disabled', 'disabled');
                }
            }
        });
    }
};