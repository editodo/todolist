<template>
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
            <v-icon class="title_font_color toolbar_icon_size">save</v-icon> <span class="toolbar_font_size">Write</span>          
        </v-toolbar-title>
      </v-toolbar>

 
    
    <v-card-text>
      <v-text-field        
        v-model="BoardData.TITLE"
        label="Title"
        required
      />
      <TiptapEditor 
          v-model="BoardData.CONTENTS"
          :editable="true"
        />
      <br>
      <v-file-input
        v-model="files"            
        counter
        chips 
        label="File input"
        multiple
        placeholder="Select your files"
        prepend-icon="mdi-paperclip"            
        :show-size="1000"
      />          
      <div class="text-right">
        <v-btn
          small
          text                
          @click="WriteData"
        >
          <v-icon left>
            save
          </v-icon>
          저장
        </v-btn>
        <v-btn
          small
          text
          to="/reference/list/1"
        >
          <v-icon left>
            list
          </v-icon>
          리스트
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>

import TiptapEditor from '@/components/Tiptap/TiptapEditor.vue';

import CONST from '@/const'
import axios from 'axios'


export default {
  components: {
    TiptapEditor : TiptapEditor,
  },
  data: () => ({
    BoardData : {
      TITLE : '',     //제목 
      CONTENTS : '',  //내용      
    },
    files: [],
    
  }),
  methods: {
    WriteData : function(){           //현재 입력 된 정보를 서버에 전송한다.

      //폼데이터를 작성한다.
      let formData = new FormData();      

      for( var i = 0; i < this.files.length; i++ ){
        let file = this.files[i];                
        formData.append('FILES[]', file);
      }

      formData.append('DATA', JSON.stringify(this.BoardData));      
      formData.append('TITLE', this.BoardData.TITLE);             //제목
      formData.append('CONTENTS', this.BoardData.CONTENTS);       //컨텐츠      

      //게시물 정보를 전송한다.
      axios.post(`${CONST.HOST_ADDR}/reference/insertBoardData`, formData,  {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }).then(
        (ret)=>{          
          console.log(ret); 
          this.$router.push('/reference/list/1');         //리스트 화면으로 이동한다.
        }
      );       


    },
  }
}
</script>

<style>

  .v-text-field .v-input__control .v-input__slot {
    min-height: auto !important;
    display: flex !important;
    align-items: center !important;
  }
</style>