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
            height="300px"
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
              to="/qna/list"
            >
              <v-icon left>
                list
              </v-icon>
              리스트
            </v-btn>
          </div>
          <br />
          <v-divider />      
          <br />


          <v-card
            color="card_background"
            >
            <v-toolbar
              flat        
              dense             
              class="title_font_color"
              :height="this.$vuetify.toolbar_height"
            >           
              <v-toolbar-title dense>
                <v-icon class="title_font_color toolbar_icon_size">question_answer</v-icon> <span class="toolbar_font_size">답변</span>
              </v-toolbar-title>
              <v-spacer />      
            </v-toolbar>

            <v-card-text>

              <v-timeline 
                dense
                >
                <v-slide-x-reverse-transition
                  group
                  hide-on-leave
                >
                  <v-timeline-item
                    v-for="item in CommentList" 
                    :key="item.CONTENTS_ID"                
                    small
                    fill-dot
                  >

                    <v-card
                      color="card_background"              
                    >
                    <v-toolbar                          
                        dense             
                        class="title_font_color"                         
                      >           
                        <v-toolbar-title dense>
                          <v-icon class="title_font_color toolbar_icon_size">face</v-icon> 
                          <span class="toolbar_font_size">{{ $GET_USER_NAME_ID(item.CREATER) }}</span> 
                          &nbsp;&nbsp;&nbsp;
                          <v-divider        
                            vertical
                            inset                            
                          />
                          &nbsp;&nbsp;&nbsp;
                          <span class="toolbar_font_size">{{ $moment(item.CREATED_DATE).format('YYYY-MM-DD HH:mm:ss') }}</span>                           
                        </v-toolbar-title>  
                        <v-spacer />
                        <v-btn
                             icon       
                             dark   
                             @click="editComment(item)"  
                             v-if="(item.isEditable != true)"
                          >
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn
                             icon       
                             dark   
                             @click="ReadCommentData(item)"  
                             v-if="(item.isEditable == true)"
                          >
                            <v-icon>cancel</v-icon>
                        </v-btn>

                        <v-btn
                             icon       
                             dark   
                             @click="modifyComment(item)"  
                             v-if="(item.isEditable == true)"
                          >
                            <v-icon>save</v-icon>
                        </v-btn>
                        <v-btn
                             icon       
                             dark   
                             @click="deleteComment(item)"  
                          >
                            <v-icon>delete</v-icon>
                        </v-btn>
                        
                      </v-toolbar>      
                      
                      <TiptapEditor 
                        v-model="item.CONTENTS"          
                        :editable="(item.isEditable == true)"
                        height="200px"
                      />
                    
                  </v-card>
                    
                </v-timeline-item>
              </v-slide-x-reverse-transition>
            </v-timeline>               
              <br />
              <br />
              <v-card
                color="card_background"              
                flat                
                >
                <v-card-text>
                  <TiptapEditor 
                    v-model="NewCommentData.CONTENTS"          
                    :editable="IsWrite"
                    height="200px"
                  />
                  <v-spacer />  
                  <div class="text-right">              
                    <v-btn
                        small
                        text   
                        @click="insertComment"         
                        v-if="(IsWrite)"
                      >
                        <v-icon left>
                          edit
                        </v-icon>
                        답변 등록
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>

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
      CONTENTS_ID : 0,
      CREATER : '',   //작성자 ID
      TITLE : '',     //제목 
      CONTENTS : '',  //내용

      
    },
    CommentList : [],   //코맨트
    NewCommentData : {
      OWNER_ID : 0,
      CREATER : '',
      CONTENTS : '',  //내용
    }
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
      if(this.BoardData.CONTENTS_ID == 0 ) return false;
      if(this.IsWrite == false) return false;
      if(this.BoardData == undefined) return false;

      if(this.USER_DATA.EMP_USER_ID == this.BoardData.CREATER) return true;

      return false;
    }
  },  
  created: function()
  {
    this.ReadData();          //게시물을 읽어온다.
    this.ReadCommentData();   //댓글 정보를 읽어 온다.
    },  
  methods: {
    ReadData : function(){           //현재 입력 된 정보를 서버에 전송한다.
      var searchCond = {cid : this.$route.params.cid};
      //게시물 정보를 전송한다.
      axios.post(`${CONST.HOST_ADDR}/Qna/selectBoardContents`, searchCond).then(
        (ret)=>{             
          this.BoardData = ret.data;
          
        }
      );       
    },
    ReadCommentData : function(){   //댓글 정보를 가져온다.

      var searchCond = {OWNER_ID : this.$route.params.cid};

      axios.post(`${CONST.HOST_ADDR}/Qna/selectBoardCommentList`, searchCond).then(
          (ret)=>{             
            this.CommentList = ret.data;
            for(var cnt = 0; cnt < this.CommentList.length; cnt++)
            {
                this.CommentList[cnt].isEditable = false;
            }
          }
        );       
        

    },
    DeleteData : async function(){
      
      if (await this.$root.$confirm.open('Confirm', '삭제 하시겠습니까??', { color: 'primary' }) == false) return;  

      axios.post(`${CONST.HOST_ADDR}/Qna/deleteBoardContents`, this.BoardData).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  //성공 했다면 리스트 화면으로 이동한다.                  
                  this.$router.push('/Qna/list');
                }
            }
          );                     
    },
    updateData : async function(){
      if (await this.$root.$confirm.open('Confirm', '수정 하시겠습니까??', { color: 'primary' }) == false) return;  
      
      axios.post(`${CONST.HOST_ADDR}/Qna/updateBoardContents`, this.BoardData).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.          
            }
          );                     
    },
    insertComment : async function(){
      if (await this.$root.$confirm.open('Confirm', '등록 하시겠습니까??', { color: 'primary' }) == false) return;  

      this.NewCommentData.OWNER_ID = this.BoardData.CONTENTS_ID;    //부모 컨텐츠 정보를 등록한다.

      axios.post(`${CONST.HOST_ADDR}/Qna/insertBoardComment`, this.NewCommentData).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.          

                if(ret.data.ret == true)
                {
                  //댓글 리스트를 새로 읽어 들인다.
                  this.ReadCommentData();
                  this.NewCommentData.CONTENTS = "";
                }
            }
          );                     
    },
    deleteComment : async function(item){
      if (await this.$root.$confirm.open('Confirm', '삭제 하시겠습니까??', { color: 'primary' }) == false) return;
      
      axios.post(`${CONST.HOST_ADDR}/Qna/deleteBoardComment`, item).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.          

                if(ret.data.ret == true)
                {
                  //댓글 리스트를 새로 읽어 들인다.
                  this.ReadCommentData();
                }
            }
          );                     
    },
    editComment : function(item){   //수정모드로 변환한다.
        item.isEditable = true;        
        this.CommentList = [...this.CommentList];   //복사해서 변경되었다는것을 화면에 알려줌..ㅡㅡa..이건
    },
    modifyComment : async function(item){   //수정된것을 DB에 저장한다.

        if (await this.$root.$confirm.open('Confirm', '저장 하시겠습니까??', { color: 'primary' }) == false) return;

        axios.post(`${CONST.HOST_ADDR}/Qna/updateBoardComment`, item).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.          
                if(ret.data.ret == true)
                {
                  //댓글 리스트를 새로 읽어 들인다.
                  this.ReadCommentData();
                }
            }
          );                     
    },
  
  
  }
}
</script>

<style>

</style>