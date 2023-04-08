
<template>
  <div class="pt-1">
    <v-card
      color="card_background"
      class="baseheight"
    >
      <v-tabs
        v-model="tab"
        :height=this.$vuetify.toolbar_height
        background-color="#28394B"
        class="title_font_color"
        dark
      >
        <v-tab href="#tab-1">
          <v-icon class="title_font_color toolbar_icon_size">history</v-icon> <span class="toolbar_font_size">구매이력</span>                    
        </v-tab>
        <v-tab href="#tab-2">
          <v-icon class="title_font_color toolbar_icon_size">info</v-icon> <span class="toolbar_font_size">업체정보</span>                    
        </v-tab>
        <v-tab href="#tab-3">
          <v-icon class="title_font_color toolbar_icon_size">analytics</v-icon> <span class="toolbar_font_size">업체평가</span>                    
        </v-tab>

        <v-spacer />      
        <v-btn          
          text
          class="title_font_color pb-1"
          @click="ExcelDownload"
        >
          <v-icon>download</v-icon>
          Excel
        </v-btn>

      </v-tabs>
      <v-divider class="my_toolbar_underline" v-if="this.$vuetify.toolbar_underline"/>          
      <v-tabs-items v-model="tab">
        <v-tab-item      
          :value="'tab-1'"
        >
          <!-- 구매이력 -->
          <InterfaceLog_buy_list  
            ref="buylist"
            />
        </v-tab-item>
        <v-tab-item      
          :value="'tab-2'"
        >
          <!-- 업체정보 -->
          <InterfaceLog_company_list 
           ref="companylist"
          />
        </v-tab-item>
        <v-tab-item      
          :value="'tab-3'"
        >
          <!-- 업체평가 -->
          <InterfaceLog_company_estimation_list 
            ref="companyestlist"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import InterfaceLog_buy_list from './InterfaceLog_buy_list'                               //구매이력
import InterfaceLog_company_list from './InterfaceLog_company_list'                       //업체정보
import InterfaceLog_company_estimation_list from './InterfaceLog_company_estimation_list' //업체평가

export default {
    components: {
      InterfaceLog_buy_list,
      InterfaceLog_company_list,
      InterfaceLog_company_estimation_list,
    },
    data: () => ({
        tab: null,
        defaultData:'',
       
    }),
    computed:{

    },
    created : function(){        
      
    },
    methods : { 
      ExcelDownload: async function()
      {            

        console.log('ExcelDownload');
        console.log(this.tab);
        if(this.tab == 'tab-1')
        {
          this.$refs.buylist.ExcelDownload();
        }
        else if(this.tab == 'tab-2')
        {
          this.$refs.companylist.ExcelDownload();
        }
        else if(this.tab == 'tab-3')
        {
          this.$refs.companyestlist.ExcelDownload();
        }

        
        
      },

       
    }

}
</script>


<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    :deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  
</style>


