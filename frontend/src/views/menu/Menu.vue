
<template>
  <div class="pt-1">
    <v-card
      color="card_background"
      class="baseheight"
    >
     <v-toolbar        
        flat
        dense
        :height="this.$vuetify.toolbar_height"
        class="title_font_color"
      >
        <v-toolbar-title 
          dense
        >
          <v-icon 
            class="title_font_color toolbar_icon_size"
            >account_tree</v-icon> <span class="toolbar_font_size"> 메뉴관리</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          class="title_font_color"
          text   
          @click="openDlg"           
        >
          <v-icon>add</v-icon>
          메뉴등록
        </v-btn>
      </v-toolbar>
      <v-divider 
        class="my_toolbar_underline" 
        v-if="this.$vuetify.toolbar_underline" 
      />          
      <v-card-text>
        <v-treeview    
          v-if="TreeViewLoading === false"
          ref="menuTree"
          :items="menuList"
          item-key="MENU_ID"
          item-text="MENU_NAME"
          open-all
          dense
          hoverable
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon>
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>                
          </template>
          <template v-slot:label="{ item, open }">
            <div
              :style="{ cursor: 'pointer'}"                  
              @dblclick="menuDblClick(item)"
            >
              {{ item.MENU_NAME }}({{ item.MENU_ID }})
              <v-btn
                icon
                small
                @click="menuDblClick(item)"
              >
                <v-icon size="20">
                  edit
                </v-icon> 
              </v-btn>
              <v-btn
                icon
                small
                @click="openDlgAdd(item)"
              >
                <v-icon size="20">
                  add
                </v-icon> 
              </v-btn>
            </div>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
    <menu-dlg 
      ref="menuDlg"      
      @SaveOK="sendMenu"      
      @ModifyOK="updateMenu"
    />
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import MenuDlg from './MenuDlg.vue'


export default {
    components: {
      MenuDlg,    //조직정보 관리 다이얼로그
    },
    data: () => ({
        menuList:[],      
        TreeViewLoading : false,        
    }),
    computed:{
      menuItems() //메뉴 항목정보를 반환한다.
      {
        var temp_menuItems = [];
        temp_menuItems.push({MENU_NAME:'/', MENU_ID:'0'})
        
        var fn_menu_items = (list)=>{
          list.forEach(element => {                                 
            temp_menuItems.push(element);                     
            if(element.children.length == 0) {                      
              return;
            }else{
              fn_menu_items(element.children);
            }             
          });            
        };
          
        fn_menu_items(this.menuList);
        return temp_menuItems;
      }
    },
    created : function(){        
      this.selectMenuList(); //메뉴리스트를 가져온다.
    },
    methods : {
        openDlg(){  //다이얼로그를 출력          
          this.$refs.menuDlg.ShowDlg(this.menuItems);   
        },
        openDlgAdd(item){  //다이얼로그를 출력          
          this.$refs.menuDlg.ShowDlg(this.menuItems, item.MENU_ID);   
        },
        selectMenuList(){
            this.TreeViewLoading = true;  
            axios.post(`${CONST.HOST_ADDR}/menu/selectMenuList`, {}).then(
            (ret)=>{                                         
                this.menuList = ret.data;   //사용자 리스트를 업데이트 한다.                
                this.TreeViewLoading = false;                
                }
            ).catch((ret)=>{console.log(ret)});      
        },  
        menuDblClick(item){   //메뉴를 더블 클릭 했을때         
          this.$refs.menuDlg.ShowModify(item, this.menuItems);             
        },
        sendMenu(item){ //신규 메뉴를 서버에 등록한다.

          axios.post(`${CONST.HOST_ADDR}/menu/insertMenu`, item).then(
            (ret)=>{             
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                            
                this.selectMenuList();
                }
            ).catch((ret)=>{console.log(ret)});      
        },
        updateMenu(item){ //메뉴 수정정보를 서버에 등록 한다.
          axios.post(`${CONST.HOST_ADDR}/menu/updateMenu`, item).then(
            (ret)=>{                                         
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                            
                this.selectMenuList();
                }
            ).catch((ret)=>{console.log(ret)});      
        }
    },
}
</script>

<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    :deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  
</style>