<template>
  <div class="pt-1">
    <v-card        
      color="card_background"
      class="baseheight"
    >    
      <v-toolbar
        flat        
        dense             
        class="title_font_color"
        :height="this.$vuetify.toolbar_height"
      >           
      
        <v-toolbar-title dense>
            <v-icon class="title_font_color toolbar_icon_size">notification_important</v-icon> <span class="toolbar_font_size">공지사항</span>          
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <PageDataTable
          :headers="headers"
          :items="BoardItemList"
          :ppage="page"
          @click:row="goDtl2"
        >
          <template 
            v-slot:item.CREATER="{item}"
            >
              {{ $GET_USER_NAME_ID(item.CREATER) }}
          </template>
          <template v-slot:pageappend="slotProps">
            <v-btn
              text
              small
              to="/notice/write"
            >
              <v-icon left>
                create
              </v-icon>
              글쓰기
            </v-btn>
          </template>
        </PageDataTable>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import PageDataTable from '@/components/DataTable/PageDataTable'
//import {mapGetters} from 'vuex';

export default {
  components: {
      PageDataTable,      
    },

  data: () => ({
    BoardItemList : [],     //게시물 리스트
    page : 1,    
     headers: [
          { text: 'No.', value: 'CONTENTS_ID',width:'100px'},
          { text: '제목',value: 'TITLE', align: 'left',                                            },
          { text: '작성자', value: 'CREATER', align: 'center', width:'150px'},
          { text: '조회수', value: 'COUNT', align: 'center', width:'150px'},          
          { text: 'Date', value: 'CREATED_DATE' ,align: 'center',width:'150px' },          
        ],

  }),
  computed:{
    

  },
      
  created : async function(){    
      
      await this.selectBoardList(); //게시물 리스트를 가져온다.
      this.page = Number(this.$route.params.page);
    
  },
  methods: {
      selectBoardList : function(){   //전체 게시물 리스트를 가져온다.        
        return axios.post(`${CONST.HOST_ADDR}/notice/selectBoardList`, {}).then(
          (ret)=>{                           
            this.BoardItemList = ret.data;
            this.page = Number(this.$route.params.page);
          }
        );       
      },      
      goDtl2 : function(item) //상세화면으로 이동한다.
      {
        var url = "/notice/detail/" + item.CONTENTS_ID;
        this.$router.push(url);       //상세화면으로 이동
      },
    
      
  }    
}
</script>

<style scoped>
  .bg_gray {
    background : whitesmoke
  }
</style>