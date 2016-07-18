# Chinese region picker plugin for jQuery

Three level selection Doms named Province, City and District, data provided by [Chinese region db][crd]


## Getting Started
Download the [production version][min] or the [development version][dev].

In your web page:

```html
<select id="inputProvince" name="province">
  <option value="" selected="selected">- 选择直辖市/省 -</option>
</select>

<select id="inputCity" name="city">
  <option value="" selected="selected">- 选择市/区 -</option>
</select>

<select id="inputDistrict" name="district">
  <option value="" selected="selected">- 选择区/县 -</option>
</select>
```

```javascript
<script src="jquery.js"></script>
<script src="PCDselector-jquery.min.js"></script>
<script>
$(function(){
  // one "regionPicker" object for one page
  regionPicker.options.defaultVal = ['北京市', '丰台区', '']; // could be empty
  regionPicker.init(['inputProvince','inputCity','inputDistrict']);
});
</script>
```

If postcode auto-fillment is needed, then add html to body
```html
<input type="text" name="postcode" value="" id="inputPostcode" placeholder="邮政编码">
```

and add js code to jQuery main entry
```javascript
regionPicker.options.postcodeDom = $('#inputPostcode');
```


### options
```javascript
{
  jsonURL: 'path_of_json_data',  //URI path of json data files
  defaultVal: ['provinceVal', 'cityVal', 'districtVal'],  //the initial value to be picked, defaule is empty
}
```


## Release History
  * 2016-05-02  v0.0.1  the first version of PCDselector plugin.

[crd]: https://github.com/xixilive/chinese_region_db
[min]: https://raw.github.com/liveangela/PCDselector-jquery/master/dist/PCDselector.min.js
[dev]: https://raw.github.com/liveangela/PCDselector-jquery/master/dist/PCDselector.js