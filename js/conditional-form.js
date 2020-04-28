// requires jQuery
$(document).ready(function(){
  // independent field elements
  var type = $('#submit_form select[name=type]');
  // dependent field elements
  var category_tool = $('#submit_form #category_tool select[name=category]');
  var category_resource = $('#submit_form #category_resource select[name=category]');
  var category_ctf_platform = $('#submit_form #category_ctf_platform select[name=category]');
  var category_operating_system = $('#submit_form #category_operating_system select[name=category]');
  // hidden parents
  var category_tool_parent = $('#submit_form #category_tool');
  var category_resource_parent = $('#submit_form #category_resource');
  var category_ctf_platform_parent = $('#submit_form #category_ctf_platform');
  var category_operating_system_parent = $('#submit_form #category_operating_system');
  var category_parents = $($.map([category_tool_parent,category_resource_parent,
    category_ctf_platform_parent,category_operating_system_parent], a => [...$.makeArray(a)]));

  var entry_name_parent = $('#submit_form #entry_name');
  var entry_os_parent = $('#submit_form #entry_os');
  var entry_for_parent = $('#submit_form #entry_for');
  var entry_based_on_parent = $('#submit_form #entry_based_on');
  var entry_language_parent = $('#submit_form #entry_language');
  var entry_country_parent = $('#submit_form #entry_country');
  var entry_website_parent = $('#submit_form #entry_website');
  var entry_source_parent = $('#submit_form #entry_source');
  var entry_description_parent = $('#submit_form #entry_description');
  var entry_programming_language_parent = $('#submit_form #entry_programming_language');
  var entry_price_parent = $('#submit_form #entry_price');
  var entry_from_parent = $('#submit_form #entry_from');
  var entry_to_parent = $('#submit_form #entry_to');
  var entry_parents = $($.map([entry_name_parent,entry_os_parent,entry_for_parent,
    entry_based_on_parent,entry_language_parent,entry_country_parent,
    entry_website_parent,entry_source_parent,entry_description_parent,
    entry_programming_language_parent,entry_price_parent,entry_from_parent,
    entry_to_parent], a => [...$.makeArray(a)]));
  // other element out of the form
  var code = $('code');
  // Conditional logic
  type.change(function(){ // when the type changes
    var value=this.value;
    category_parents.addClass('is-hidden'); // hide all categories
    entry_parents.addClass('is-hidden'); // hide all entries

    if(value == 'tool'){
      category_tool_parent.removeClass('is-hidden'); // show category_tool
    } else if(value == 'resource') {
      category_resource_parent.removeClass('is-hidden'); // show category_resource
    } else if(value == 'ctf_platform'){
      category_ctf_platform_parent.removeClass('is-hidden'); // show category_ctf_platform
    } else if(value == 'operating_system'){
      category_operating_system_parent.removeClass('is-hidden'); // show category_operating_system
    }
  });
  category_tool.change(function(){ // when the category tool changes
    var value=this.value;
    entry_parents.addClass('is-hidden'); // hide all entries

    if(value == 'plugins'){
      var tool_plugins = $($.map([entry_name_parent,entry_for_parent,entry_website_parent,
        entry_source_parent,entry_description_parent,
        entry_programming_language_parent,entry_price_parent], a => [...$.makeArray(a)]));
        tool_plugins.removeClass('is-hidden');
    } else {
      var tool_generic = $($.map([entry_name_parent,entry_website_parent,
        entry_source_parent,entry_description_parent,
        entry_programming_language_parent,entry_price_parent], a => [...$.makeArray(a)]));
      tool_generic.removeClass('is-hidden');
    }
  });
  category_resource.change(function(){ // when the category resource changes
    var value=this.value;
    entry_parents.addClass('is-hidden'); // hide all entries

    if(value == 'national_security_agencies_and_services'){
      var resource_national_security_agencies_and_services = $($.map([entry_name_parent,
        entry_country_parent,entry_website_parent,entry_source_parent,
        entry_description_parent], a => [...$.makeArray(a)]));
      resource_national_security_agencies_and_services.removeClass('is-hidden');
    } else if(value == 'information' || value == 'non_english'){
      var resource_non_english = $($.map([entry_name_parent,entry_language_parent,
        entry_website_parent,entry_source_parent,entry_description_parent,
        entry_price_parent], a => [...$.makeArray(a)]));
      resource_non_english.removeClass('is-hidden');
    } else {
      var resource_generic = $($.map([entry_name_parent,
        entry_website_parent,entry_source_parent,entry_description_parent,
        entry_price_parent], a => [...$.makeArray(a)]));
      resource_generic.removeClass('is-hidden');
    }
  });
  category_ctf_platform.change(function(){ // when the category ctf platform changes
    entry_parents.addClass('is-hidden'); // hide all entries
    // all have the same template
    var ctf_platform_generic = $($.map([entry_name_parent,entry_website_parent,
      entry_source_parent,entry_description_parent,
      entry_programming_language_parent,entry_price_parent], a => [...$.makeArray(a)]));
    ctf_platform_generic.removeClass('is-hidden');
  });
  category_operating_system.change(function(){ // when the category operating system changes
    var value=this.value;
    entry_parents.addClass('is-hidden'); // hide all entries

    if(value == 'project_transferred'){
      var operating_system_project_transferred = $($.map([entry_from_parent,
        entry_to_parent], a => [...$.makeArray(a)]));
      operating_system_project_transferred.removeClass('is-hidden');
    } else {
      var operating_system_generic = $($.map([entry_os_parent,entry_based_on_parent,
        entry_website_parent,entry_description_parent], a => [...$.makeArray(a)]));
      operating_system_generic.removeClass('is-hidden');
    }
  });
  // add more power to the reset button
  $('button[type=reset]').on('click',function(){
    // reset code
    code.text('');
    code.addClass('is-hidden');
    // hide notification
    hideNotification();
    // hide all categories and entries
    category_parents.addClass('is-hidden');
    entry_parents.addClass('is-hidden');
  });
  // preview code
  $('button[type=button]').on('click',function(){
    // put data in the code tag
    code.text(retrieveData());
    code.removeClass('is-hidden');
  });
});
// prevent form submission
$('form').submit(function(e){
  e.preventDefault();
  submitForm();
});
// sending form logic
function submitForm(){
  $.ajax({
    type: 'POST',
    url: 'https://hooks.zapier.com/hooks/catch/4221939/o58jzaq/',
    data: retrieveData(),
    success: function(){},
    dataType: 'json',
    // contentType : 'application/json' <-- problems with CORS
  });
  // push notification
  var notification = $('.notification span');
  notification.text('Your submission has been sent!');
  notification.parent().removeClass('is-hidden');
}
// serializeArray => key:value
// https://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery#answer-1186309
function objectifyForm(formArray) {//serialize data function

  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}
// hide notification
function hideNotification(){
  $('.notification').addClass('is-hidden');
}
// hide notification on click on delete button
$(document).on('click', '.notification > button.delete', function() {
  hideNotification();
  return false;
});
// retrieve data
function retrieveData(){
  var rawFormData = $("#submit_form :input:not(:hidden)").serializeArray();
  var formatedFormData = objectifyForm(rawFormData);
  var jsonFormData = JSON.stringify(formatedFormData,null,'  ');
  return jsonFormData;
}
