
$(function () {
    console.log("FUT");
    var $modal = $('#newErrorModal').modal({show: false});
    var $modalBody = $modal.find('.modal-body');
    
    $('#newErrorButton').on('click', function(e){
        console.log("nyomva");
        e.preventDefault();
        $modalBody.load(this.href + ' #newContent', function(){
            $modal.modal('show');
            
            var $form = $('form[data-toggle=validator]');
            $form.validator();
            
            $form.on('submit', function(f) {
                f.preventDefault();
                
                $.ajax({
                    url: 'contacts/new',
                    method: 'post',
                    data: $form.serializeArray(),
                    dataType: 'json'
                })
                .done(function(data)
                {
                    if(data)
                    {
                        $modal.modal('hide');
                        var tr = 
                            '<tr>' + 
                            '<td>'+data.date+'</td>' + 
                            '<td><span class="label label-danger">'+data.status+'</span></td>' + 
                            '<td>'+data.location+'</td>' + 
                            '<td><span class="badge">0</span>'+data.description+'</td>' + 
                            '<td><a class="btn btn-danger btn-sm torles-gomb" href="/errors/delete/'+data.id+'" role="button">Törlés</a></td>' + 
                            '</tr>';
                        $('#new tbody').append(tr);
                    }
                });
            });
        });
    });
    
});

