import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
//import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);


export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: { 
    // options: {
    //   customProperties: true,
    // },   
       

    themes: {
      light: {
        // primary: colors.indigo.base, // #3F51B5        
        // secondary: colors.indigo.darken2, // #C5CAE9
        // accent: colors.indigo.accent1, // #8C9EFF
        // anchor: '#8c9eff'


        // primary: colors.indigo.darken2, // #3F51B5        
        // secondary: colors.indigo.darken4, // #C5CAE9
        // accent: colors.indigo.accent1, // #8C9EFF
        // anchor: '#8c9eff'
        
        // primary: colors.indigo.darken2, // #3F51B5        
        // secondary: colors.indigo.darken1, // #C5CAE9
        // accent: colors.indigo.accent1, // #8C9EFF
        // anchor: '#8c9eff'

        //primary: '#607D8B',
        

        primary: '#003776',
        
        //secondary: '#027DC9', // #C5CAE9
        secondary: '#28394B', // #28394B
        
        //secondary: '#003876', // #C5CAE9
        //accent: '#ffffff', // #8C9EFF
        accent: '#EF174A', // #8C9EFF //2022-07-23 woo 달력에 문제 있어서 원복..
        //accent: colors.blueGrey.accent1, // #8C9EFF
        anchor: '#8c9eff',

        table: '#ffffff',
                

        card_background: '#FAFAFA',    //카드내부 배경색상 #툴바 관련 옵션#
        

      },
     
    },
  },
  
});

