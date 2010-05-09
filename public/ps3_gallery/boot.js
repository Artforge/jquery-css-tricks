$(document).ready(function(){
    //$(".menu > *").css("border", "3px double red");
    
    
    $("li",$('.menu')).mouseover(function() {
        $(this).animate({
            backgroundColor: "#67748d"
        },{ queue:false, duration:200 })
    }).mouseout(function() {
        $(this).animate({
             backgroundColor: "#000000"
        },{ queue:false, duration:200 })
    });

	
});
