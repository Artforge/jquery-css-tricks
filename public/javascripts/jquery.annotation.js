(function($) {

	$.fn.annotation = function(excerpt,settings) {
		var config = {
			insights: [],
			comment: "",
			available_insights: [],
			template: $("<div>"),
			onMouseOver: "",
			onMouseOut: ""
		};
		if (settings) $.extend(config, settings);
		
		var container = this;
		var excerpt = excerpt || "";
		var insights = config.insights;
		var comment = config.comment || "";
		var available_insights = config.available_insights;
		
		render();
		
		container.mouseover(function(){
			if($.isFunction(config.onMouseOver)){
				config.onMouseOver.call(this, excerpt);
			}
		});
		
		container.mouseout(function(){
			if($.isFunction(config.onMouseOut)){
				config.onMouseOut.call(this, excerpt);
			}
		});
		
		return this; 
		
    	function render(){
			container.append(config.template.clone());
			container.find(".excerpt").html(excerpt);
			initToolBox();
			initComment();
			initInsights();
		}
	
		function initComment(){
			if (comment.length > 0){
				container.find("div.comment").show();
				container.find("div.comment textarea").val(comment);
			}
		}
	
		function initInsights(){
			container.find(".insight_field").autocomplete(available_insights);
			if (insights.length > 0){
				container.find(".insights").show();
				container.find(".empty_message").hide();
				jQuery.each(insights, function() {if (this != ""){renderTag(this.toString())}});
			}
		}

		function initToolBox(){
			container.find("span.trash").click(function(){container.fadeOut()});
			container.find("span.comment").click(function(){attachComment()});
			container.find("span.attach").click(function(){attachInsights()});
			container.find("span.insight_button").click(function(){addTags();})
		}
	
		function attachInsights(){
			container.find(".insight_form").slideToggle();
			// When closing the insight form, leave insights list open if populated
			(insights && insights.length > 0) ? container.find(".insights").show() : container.find(".insights").slideToggle();
		}
	
		function attachComment(){
			container.find("div.comment").slideToggle();
		}
	
		function addTags(){
			arrNewInsights = container.find(".insight_field").val().split(",");
			console.log("arrNewInsights",arrNewInsights);
			if (arrNewInsights.length > 0){
				container.find(".empty_message").hide();
				jQuery.each(arrNewInsights, function() {
					if (this != ""){addTag(this)}
				});
			}
			container.find(".insight_field").val("");
		}
	
		function addTag(strTag){
			// strTag = strTag.toLowerCase();
			strTag = strTag.toString();
			if (insights.indexOf(strTag) < 0){
				insights.push(strTag);
				renderTag(strTag);
				updateTagFormElement()
			}
		}
	
		function renderTag(strTag){
			tag = $('<div>').addClass("insight").click(function(){removeTag(tag,strTag)});
			tag.append($('<a>').html("*"));
			tag.append($('<span>').html(strTag));
			container.find(".insights").prepend(tag)
		}
	
		function removeTag(elTag,strTag){
			arr_updated = new Array();
			jQuery.each(insights, function() {
				if (this != strTag){
					arr_updated.push(this);
				}
			});
			insights = arr_updated;
			console.log("arr_updated",arr_updated)
			if (insights.length < 1){container.find(".empty_message").show();}
			elTag.hide();
			updateTagFormElement()
		}
	
		function updateTagFormElement(){
			// elFormTagElement.value = arr_tags.toString();
		}
	}
 
 })(jQuery);

