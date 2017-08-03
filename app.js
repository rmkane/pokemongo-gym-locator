$(function() {
    $.ajax({
        url: 'data.json',
        cache : true,
        contentType : 'application/json',
        success : function(result,status,xhr){
            console.log(result);
        },
        error : function(xhr, status, error) {
            console.log('Error: ' + result);
        }
    });
});
