<template>
  <v-dialog
    v-model="IsShowDlg"
    persistent
    max-width="1200"   
  >
    <v-card>
       <v-toolbar        
        flat        
        dense             
        :height="this.$vuetify.toolbar_height"
        class="title_font_color"
      >
        <v-toolbar-title class="px-0">
          <span class="toolbar_font_size">시황정보</span>
        </v-toolbar-title>        
        <v-spacer />
        <v-btn
          icon
          class="title_font_color"
          @click="dlgClose"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <div style="height:20px"></div>
      <v-card-text>
        <v-row
         class="pt-5"
         >
          <v-col>
            <div style="width:100%; height: 40px;display: flex; align-items: center; justify-content: center;">
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#F48FB1"
                    size="30px"
                    >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.petronet.co.kr/v3/index.jsp"
                  ><span class="link_text"> 한국석유공사(유가정보) </span></a><br>
                  <span class="corp_text">전선, MnM</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#c5b382" 
                    size="30px"
                  >rss_feed</v-icon></span>
                <span>
                  <a 
                    target="_blank" 
                    href="http://www.snmnews.com/" 
                  ><span class="link_text"> 철강금속신문 </span></a><br>
                  <span class="corp_text">Electric, MnM</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#81D4FA" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://kr.investing.com/commodities/" 
                  ><span class="link_text"> 금융시장 플랫폼(Investing) </span></a><br>
                  <span class="corp_text">전선</span>
                </span>
              </div>              
            </div>
          </v-col>
        </v-row>
        <v-row
          class="pt-5"
          >
          <v-col>
            <div style="width:100%; height: 40px;display: flex; align-items: center; justify-content: center;">
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#F48FB1"
                    size="30px"                 
                    >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.motie.go.kr/motie/py/sa/todayeconomyindexprice/todayEconomyIndexPri.jsp" 
                  ><span class="link_text"> 산업통상자원부 원자재가격정보 </span></a><br>
                  <span class="corp_text">전선</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#c5b382" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="http://dmh.or.kr/forceboard/index_new.php" 
                  ><span class="link_text"> 대한목재협회 </span></a><br>
                  <span class="corp_text">전선</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#81D4FA" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.chemlocus.co.kr/" 
                  ><span class="link_text"> 화학경제연구원 </span></a><br>
                  <span class="corp_text">전선, MnM</span>
                </span>
              </div>             
            </div>
          </v-col>
        </v-row>
        <v-row
          class="pt-5"
          >
          <v-col>
            <div style="width:100%; height: 40px;display: flex; align-items: center; justify-content: center;">
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#F48FB1"     
                    size="30px"            
                    >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.fnguide.com/" 
                  ><span class="link_text"> FnGuide(원유/원자재 시황 등 보고서) </span></a><br>
                  <span class="corp_text">전선</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#c5b382" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.kores.net/komis/price/mineralprice/basemetals/pricetrend/baseMetals.do?mnrl_pc_mc_seq=501" 
                  ><span class="link_text"> 한국자원정보서비스(주요 광물가격) </span></a><br>
                  <span class="corp_text">Electric</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#81D4FA" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.kores.net/komis/main/userMain/main.do" 
                  ><span class="link_text"> 한국자원정보서비스(시황, 가격예측 정보) </span></a><br>
                  <span class="corp_text">Electric</span>
                </span>
              </div>             
            </div>
          </v-col>
        </v-row>
        <v-row
          class="pt-5"
          >
          <v-col>
            <div style="width:100%; height: 40px;display: flex; align-items: center; justify-content: center;">
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#F48FB1"       
                    size="30px"          
                    >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.ltmetal.co.kr/kr/5_customer/sub_sg_list.html?m_year=2022&m_month=3&type=111" 
                  ><span class="link_text"> 엘티메탈(Ag 국내고시가, LBMA) </span></a><br>
                  <span class="corp_text">Electric</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#c5b382" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="http://sommetal.co.kr/sub/sub05_03.php"
                  >
                  <span class="link_text"> 서울금속공업(Cu, AL 국내고시가, LME) </span></a><br>
                  <span class="corp_text">Electric</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#81D4FA" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.kebhana.com/cont/mall/mall15/mall1503/index.jsp" 
                  ><span class="link_text"> 하나은행(환율) </span></a><br>
                  <span class="corp_text">Electric</span>
                </span>
              </div>              
            </div>
          </v-col>
        </v-row>
        <v-row
          class="pt-5"
          >
          <v-col>
            <div style="width:100%; height: 40px;display: flex; align-items: center; justify-content: center;">
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#F48FB1"
                    size="30px"
                    >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.kcif.or.kr/front/board/reportList.do" 
                  ><span class="link_text"> 국제금융센터(국제 시황뉴스) </span></a><br>
                  <span class="corp_text">Electric</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#c5b382" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.opinet.co.kr/user/main/mainView.do" 
                  ><span class="link_text"> 오피넷(유가정보) </span></a><br>
                  <span class="corp_text">MnM</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#81D4FA" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="https://www.kpi.or.kr/www/" 
                  ><span class="link_text"> 한국물가정보(물가정보) </span></a><br>
                  <span class="corp_text">MnM</span>
                </span>
              </div>              
            </div>
          </v-col>
        </v-row>
        <v-row
          class="pt-5"
          >
          <v-col>
            <div style="width:100%; height: 40px;display: flex; align-items: center; justify-content: center;">
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#F48FB1"    
                    size="30px"             
                    >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="http://www.sunsirs.com/" 
                  ><span class="link_text"> SunSirs(중국시세정보) </span></a><br>
                  <span class="corp_text">MnM</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#c5b382" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="http://www.scrapwatch.net/" 
                  ><span class="link_text"> 스크랩워치 </span></a><br>
                  <span class="corp_text">엠트론</span>
                </span>
              </div>
              <div class="div_border">
                <span>
                  <v-icon 
                    color="#81D4FA" 
                    size="30px"
                  >rss_feed</v-icon>
                </span>
                <span>
                  <a 
                    target="_blank" 
                    href="http://www.steeldaily.co.kr" 
                  ><span class="link_text"> 스틸데일리 </span></a><br>
                  <span class="corp_text">엠트론</span>
                </span>
              </div>              
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer /> 
        <v-btn
          text
          color="primary"  
          @click="dlgClose"          
        >
          닫기
        </v-btn>        
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    data: () => ({
        
        IsShowDlg : false,          //다이얼로그 표시여부            
    }),
    methods: {
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        ShowDlg(){  //다이얼로그를 출력한다.                       
          this.IsShowDlg = true;            
        },
    }

}
</script>

<style scoped>
  .bg_gray {
    background : whitesmoke
  }

  .link_text {
    height: 30px;
    flex-grow: 0;
    margin: 30px 0px 0px 0px;
    font-family: NotoSans;
    font-size: 15px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #000049; 
    position:relative;
  }

  .div_border {
     width: 350px; 
     height: 60px; 
     border: 1px solid; 
     margin: 10px 10px 10px 10px ;
     text-align:left; 
     padding: 3px 10px 3px 10px ;
     border-radius: 15px; 
     border-color: #d0d0d0;
     display: flex;
     align-items: center; 
     justify-content: left;
  }

  .corp_text {    
    font-family: NotoSans;
    font-size: 12px;    
    justify-content: left;
    text-align: left !important;
    align-items: left; 
    
  }
</style>
