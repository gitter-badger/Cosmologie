var modules_history = new Array();
var index_history = -1;

$(document).ready(function() {
  $("#timeline ul a").click(function() {
      show_content($(this).data('cid'));
      return false;
  });
  $("a.ressource").click(function() {
      show_ressource($(this).data('rid'));
      return false;
  });
  $("#show_timeline").click(function() {
      show_timeline();
      return false;
  });
});

function update()
{
    $("a.ressource").unbind("click");
    $("a.ressource").click(function() {
      show_ressource($(this).data('rid'));
      return false;
    });
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

function update_history(type, id)
{
    modules_history.push(new Array(type, id));
    index_history = -1;
}

function show_timeline()
{
  hide_content();
  hide_ressource();
  $("#show_timeline").hide();
  $("#timeline").show();
}

function hide_timeline()
{
  $("#timeline").hide();
  $("#show_timeline").show();
}

function show_content(id)
{
  $.ajax({
    url: 'contents/content_' + id + '.html',
    type: 'GET',
    cache: false, // disable when ready
    success: function(data) {
      update_history("content", id);
      hide_timeline();
      data_object = $($.parseHTML(data)); 
      $('#content #timeline').html(data_object.find('#horizontal_timeline').html());
      $('#content .title').text(data_object.find('#title').text());
      $('#content .text').html(data_object.find('#text').html());
      $('#content .references').html(data_object.find('#references').html());
      $('#content .image').html(data_object.find('#image').html());
      $('#content').show();
      setTimeout(update, 100);
    },
    error: function(e) {
      console.log(e.message);
    }
  });
}

function hide_content(id)
{
  $("#content").hide();
}

function show_ressource(id)
{
  hide_timeline();
  $.ajax({
    url: 'ressources/ressource_' + id + '.html',
    type: 'GET',
    cache: false, // disable when ready
    success: function(data) {
      update_history("ressource", id);
      data_object = $($.parseHTML(data)); 
      $('#ressource .title').text(data_object.find('#title').text());
      $('#ressource .text').html(data_object.find('#text').html());
      $('#ressource .references').html(data_object.find('#references').html());
      $('#ressource').show();
      setTimeout(update, 100);
    },
    error: function(e) {
      console.log(e.message);
    }
  });
}

function hide_ressource(id)
{
  $("#ressource").hide();
}

function browse_history(type, direction)
{
    index = index_history > 0 && index_history < modules_history.length ? index_history : modules_history.length;
    if(type!="content" && type!="ressource") next_index = min(max(index+direction, 0), modules_history.length);
    next_index = index;
    for(i = index+direction; i >= 0 && i < modules_history.length; i+=direction)
    {
        if((type!="content" && type!="ressource") || modules_history[i][0] == type)
        {
            next_index = i;
            break;
        }
    }
    if(index == next_index) return 0;
    if(modules_history[index][0] == "content") show_content(modules_history[index][1]);
    else show_ressource(modules_history[index][1]);
}
