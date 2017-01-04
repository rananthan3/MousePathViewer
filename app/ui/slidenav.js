define("ui/slidenav", ["config", "slide", "jquery", "webix"], function(config, slide, $, aperio) {

    var thumbnailsPanel = {
        view: "dataview",
        id: "thumbnails_panel",
        select: true,        
        template: "<div class='webix_strong'>#name#</div><img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail'/>",
        datatype: "json",
		type: {
            height: 170,
            width: 200
        },
        on: {
            "onItemClick": function(id, e, node) {
                item = this.getItem(id);
                slide.init(item);
            }
        }
    };

    

    //dropdown for slide groups 
    //Data is pulled from DAS webservice
    dropdown = {
        view: "combo",
        placeholder: "Select Slide Set",
        id: "slideset_list",
        options: {
            body: {
                template: "#name#"
            }
        },
        on: {
            "onChange": function(id) {
				
                $$("thumbnail_search").setValue("");
                var item = this.getPopup().getBody().getItem(id);              

                var url = config.BASE_URL + "/item?folderId="+item._id+"&limit=500";
                $$("thumbnails_panel").clearAll();
                $$("thumbnails_panel").setPage(0);
                $$("thumbnails_panel").load(url);
				
				
            },
            "onAfterRender": function() {
                //get the ID of the COLLECTION_NAME
                 $.get(config.BASE_URL + "/resource/lookup?path=/collection/" + config.COLLECTION_NAME)
                    .then(function(collection) {
                        //get the folders (cohorts) for that collection
			
                        return $.get(config.BASE_URL + "/folder?parentType=collection&parentId=" + collection._id);
                    }).then(function(folders) {
                        var foldersMenu = $$("slideset_list").getPopup().getList();
                        foldersMenu.clearAll();
                        foldersMenu.parse(folders);
                        $$("slideset_list").setValue(folders[0].id);
                        url = config.BASE_URL + "/item?folderId="+folders[0]._id+"&limit=500";
			
			$$("thumbnails_panel").clearAll();
                	$$("thumbnails_panel").setPage(0);
                	$$("thumbnails_panel").load(url);
                    }).done(function() {
                        
                    });
            }
        }
    };

    filter = {
        view: "search",
        id: "thumbnail_search",
        placeholder: "Search",
        
    };



scroll = {	view:"scrollview", 
  			id:"scrollview",
			//margin-left: "18px",
			//margin-top: "18px", 
			css: "myClass",
  			scroll:"y", 
  			height: 160, 
  			width: 100, 
			body:{   			
   }
};


scroll2 = {	view:"scrollview", 
  			id:"scrollview",
			//margin-left: "18px",
			//margin-top: "18px", 
			//css: "myClass", 
  			scroll:"y", 
  			height: 160, 
  			width: 100, 		
			body:{
				 view:"datatable",
				scroll: "false", 
				autowidth: "true",
    			columns:[
        				{ id:"property",    header:"property", width:150},
        				{ id:"value",   header:"value",    width:150}
    					],
    			data: [
        				{ property:"Mouse Position", value:"NA"},
        				{ property:"Image Dimentsions", value:"1920 X 1080"}
    				]
     			
   			}
};

group = {cols: [{view:"button", label:"Group"}, {view:"button", label:"UnGroup"}]};

group2 = {rows: 
			[
				{cols: [{view:"button", label:"SB2"}, {view:"button", label:"SB3"}, {view:"button", label:"CTRL1"}]}, 
				{cols: [{view:"button", label:"CTRL3"}, {view:"button", label:"CTRL4"}, {view:"button", label:"RN1"}]}
		]};

group3 = {rows: 
			[
				{cols: [{view:"button", label:"TB1"}, {view:"button", label:"TB2"}, {view:"button", label:"TB3"}]}, 
				{cols: [{view:"button", label:"TB5"}, {view:"button", label:"bleh"}, {view:"button", label:"schmuck"}]}
		]};




    //slides panel is the left panel, contains two rows 
    //containing the slide group dropdown and the thumbnails panel 
    var wideIcon = "<span class='aligned wide webix_icon fa-plus-circle'></span>";
    var narrowIcon = "<span class='aligned narrow webix_icon fa-minus-circle'></span>"
      
    slidesPanel = {
        id: "slidenav_panel",
        header: "Slides " + wideIcon + narrowIcon,
        headerAlt: "Expand the view",
        onClick:{
            wide:function(event, id){      
              $$("viewer_panel").config.width = 1;
              $$(id).config.width = null; 
              $$("root").resize()
              return false;
            }, 
            narrow:function(event, id){
              $$(id).config.width = 220;
              $$("viewer_panel").config.width = null; 
              $$("root").resize()
              return false;
            }
        },
        body: {
            rows: [
                dropdown, filter, scroll, scroll2, group, {height:20},group2,{height:10}, group3,  thumbnailsPanel
            ]
        },
        width: 220
    };

    

   
    return {
        view: slidesPanel
    }
});