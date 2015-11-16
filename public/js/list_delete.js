
$(function(){
    $(document).on('click', 'a.torles-gomb', function(e){
        console.log("TÖRLÉS");
        e.preventDefault();
        var $tr = $(this).closest('tr');
        
        $.getJSON(this.href)
            .done(function(data){
                if(data)
                {
                    $tr.hide('slow');
                }
            })
    })
})
