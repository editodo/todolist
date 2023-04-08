<template>
  <div>
    <router-view />   
  </div>
</template>

<script>
//import confirm from '@/components/Dialog/Confirm.vue'                   //컨펌 다이얼로그
//import commretmsg from '@/components/CommResultMsg/CommResultMsg.vue'   //전송 결과 표시 스넥바
//import toastmsg from '@/components/CommResultMsg/ToastResultMsg.vue'   //전송 결과 표시 스넥바

  
  export default {
    components: {
    
    },
    props: {      
      source:{type: String, default:null}
    },
    data: () => ({
      drawer: null
    }),
    created () {        
      this.$vuetify.theme.dark = false; //다크모드 사용 안함.

      //#툴바 관련 옵션#
      this.$vuetify.toolbar_height='30';  //서브 툴바 높이
      this.$vuetify.toolbar_underline=false;  //서브 아래에 언더라인 넣을지여부

      console.log('app.created');
      

    },
    mounted(){
      //공통컴포넌트 등록
      
      console.log('app.mounted');
      //console.log(this.$refs.common_confirm);
      

      //this.$root.$confirm = this.$refs.common_confirm;    //컨펌 다이얼로그를 Root에 등록 한다.
      //this.$root.$commretmsg = this.$refs.commretmsg;     //전송 결과 표시 스넥바      
      //this.$root.$toastmsg = this.$refs.toastmsg;         //토스트 메시지
    }
  }
</script>

<style lang="scss">
  @import "@/assets/scss/config.scss";    

  .bg_gray {
    background : whitesmoke
  }
  /*선택된 행에 대한 클래스 */
  .active_row{
    background : #E8EBF6  !important;
    color:#3f51b5 !important;    
  }

  /*요클래스 넣으면 Card 세로길이 자동 지정(Top Card만 가능) */
  .baseheight {
    height: calc(100vh - 150px);
    overflow-y: auto;    
  }
  
  /*요클래스 넣으면 필요시 세로 스크롤바 생김... */
  .scroll_y {
    overflow-y: auto;
  }

  /*요클래스 넣으면 텍스트 박스 가운데 정렬됨..*/
  .centered-input input {
    text-align: center
  }

  .bg_toolbar {
    background-color: $card-backgroundcolor !important;
  }



/*v-DataTable 백그라운드 칼라 변경*/
  .std_datatable {
      background-color: $card-backgroundcolor !important; 
      border: 1px solid #e0e0e0;
    text-overflow: ellipsis;
    overflow: hidden;
    
    }

  .defaultBackColor{
    background-color: $card-backgroundcolor !important;  
    border: 1px solid #e0e0e0; 
  }

/*v-DataTable 헤더값 변경*/
  .std_datatable thead tr th{
    /* background-color: #28394B !important;    */
    background-color: #f0f0f0 !important;   
    /* background-color: var(--v-primary-base) !important;    */

    /*color:whitesmoke !important;   */
    //color:#666666 !important;
    color-adjust: whitesmoke !important; 
    border: 1px solid #e0e0e0;
    
    
    
  }
/*v-DataTable 아이콘 칼라 변경*/  
  .std_datatable th i{ 
    //color:whitesmoke !important;  
    //border: 1px solid #c2edf8; 
  }
  .std_datatable tbody tr:nth-of-type(odd) {
      background-color: #ffffff;
   }
    
  /*v-DataTable에 cursor_p 넣으면 */  
  .cursor_p tbody tr {
    cursor: pointer;
  }

  .tbody tr {
    border: 1px solid #c2edf8;        
  }
  

  
  .std_datatable th, td {
    /*border: 1px dotted #070231;*/
    border: 0.01rem solid #EEEEEE;
    text-overflow: ellipsis;
    overflow: hidden;    
    font-size: 0.78rem;    
    padding: 0 5px !important;    
  }


  ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      background-color: #28394B;
      background-clip: content-box;
  }

  ::-webkit-scrollbar-track {
    background-color:rgba(255, 255, 255, 0.85) /*스크롤바 트랙 색상*/
  }

  ::-webkit-scrollbar-thumb {
    background-color:#28394B; /*스크롤바의 색상*/
    border-radius: 1px;
  }

//#툴바 관련 옵션#
//툴바의 폰트 사이즈
.toolbar_font_size{
  //font-size:large !important;  
  font-size:1rem !important;  
}

//#툴바 관련 옵션#
//툴바의 아이콘 사이즈
.toolbar_icon_size {
  font-size:27px !important;
}
 
 //#툴바 관련 옵션#
 //타이틀의 폰트컬러(config.scss에서 변경할것!!!!!!!!!!!)
 .title_font_color{
  color:$sub-title-font-color !important;
}
//#툴바 관련 옵션#
 //툴바 언더라인 관련 옵션
.my_toolbar_underline
{
  margin: 5px 5px 5px 5px;
  //color: #3f51b5;
}

.v-text-field__slot
{
  font-size: 0.9rem;
  font-family: NotoSans;
  font-weight: 500;
}

//헤더 아이콘 색깔!~
.v-data-table-header .v-icon {
  //color: #999999 !important;
  
}

</style>

<style >
  
  

  

</style>



