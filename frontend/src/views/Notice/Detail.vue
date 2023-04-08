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
            <v-icon class="title_font_color toolbar_icon_size">notifications</v-icon> <span class="toolbar_font_size">상세보기</span>
          </v-toolbar-title>
          <v-spacer />      
          
        </v-toolbar>
        <v-card-text>
          <v-row>            
            <v-col cols="3">
              <v-text-field 
                :value="$GET_USER_NAME_ID(BoardData.CREATER)"       
                dense
                label="작성자"
                hide-details="auto"
                readonly                
              />
            </v-col>
            <v-spacer />
            <v-col cols="2">
              <v-text-field 
                :value="$moment(BoardData.CREATED_DATE).format('YYYY-MM-DD HH:mm:ss')"                
                dense
                label="작성일시"
                hide-details="auto"
                readonly
              />              
            </v-col>
            <v-col cols="1">
              <v-text-field                 
                v-model="BoardData.COUNT"       
                dense
                label="조회수"
                hide-details="auto"
                readonly                
              />              
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field 
                v-model="BoardData.TITLE"       
                dense
                label="제목"                
                :readonly="!isEditable"
                hide-details                
              />
            
            </v-col>
          </v-row>        
          <br />
          <TiptapEditor 
            v-model="BoardData.CONTENTS"          
            :editable="isEditable"
          />
          <div class="text-right">              
            
            <!-- 삭제기능 -->
            <v-btn
              small
              text
              v-if="(IsDelete == true)&& (USER_DATA.EMP_USER_ID == BoardData.CREATER)"
              @click="DeleteData"
              >
              <v-icon left>
                delete
              </v-icon>
              삭제
            </v-btn>
            
            <v-btn
              small
              text
              @click="updateData"
              v-if="(isEditable)"
            >
              <v-icon left>
                edit
              </v-icon>
              수정
            </v-btn>
            <v-btn
              small
              text
              to="/notice/list"
            >
              <v-icon left>
                list
              </v-icon>
              리스트
            </v-btn>

          </div>
        </v-card-text>
      </v-card>
  
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import TiptapEditor from '@/components/Tiptap/TiptapEditor.vue';
import {mapGetters} from 'vuex';

export default {
  components: {    
    TiptapEditor : TiptapEditor
  },
  data: () => ({
    BoardData : {
      CREATER : '',   //작성자 ID
      TITLE : '',     //제목 
      CONTENTS : ''  //내용
    },
  }),
  computed : {
      ...mapGetters(
                    [
                    'IsWrite',      //쓰기 권한이 있는가?
                    'IsDelete',     //삭제 권한이 있는가?                    
                    'USER_DATA',
                    //'GET_USER_LIST_INFO',
                    ]),
    isEditable()    //수정가능한지
    {
      if(this.IsWrite == false) return false;
      if(this.BoardData == undefined) return false;

      if(this.USER_DATA.EMP_USER_ID == this.BoardData.CREATER) return true;

      return false;
    }
  },  
  created: function()
  {
      this.ReadData();
  },  
  methods: {
    ReadData : function(){           //현재 입력 된 정보를 서버에 전송한다.
      var searchCond = {cid : this.$route.params.cid};
      //게시물 정보를 전송한다.
      axios.post(`${CONST.HOST_ADDR}/notice/selectBoardContents`, searchCond).then(
        (ret)=>{             
          this.BoardData = ret.data;
        }
      );       
    },
    DeleteData : async function(){
      
      if (await this.$root.$confirm.open('Confirm', '삭제 하시겠습니까??', { color: 'primary' }) == false) return;  

      axios.post(`${CONST.HOST_ADDR}/notice/deleteBoardContents`, this.BoardData).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  //성공 했다면 리스트 화면으로 이동한다.                  
                  this.$router.push('/notice/list');
                }
            }
          );                     
    },
    updateData : async function(){

      if (await this.$root.$confirm.open('Confirm', '수정 하시겠습니까??', { color: 'primary' }) == false) return;  
      
      axios.post(`${CONST.HOST_ADDR}/notice/updateBoardContents`, this.BoardData).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.          
            }
          );                     

    },
   
  }
}
</script>

<style>

</style>