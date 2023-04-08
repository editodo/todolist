<template>
  <Bar
  :chart-options="chartOptions"   
  :chart-data="chartData" 
  :chart-id="chartId" 
  :dataset-id-key="datasetIdKey"  
  :plugins="plugins"  
  :css-classes="cssClasses"   
  :styles="styles"
  :width="width"  
  :height="height"
  />
</template>

<script>
//import { Bar } from 'vue-chartjs'
import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
    chartData:{
         type: Object, 
         default:()=>{
         }
    },
    cursor: {      
      type : Boolean,
      default: false
    }
    
  },
  data:() => ({
     
      chartOptions: {
        responsive: true,    
        maintainAspectRatio: false,

       
       
      },
    }),
    mounted() {
      this.chartOptions.onClick = this.ChartOnClick;        
      this.chartOptions.onHover = this.onHoverEvent;
    },
    methods : {
      ChartOnClick : function(event){
        var item = event.chart._active[0].index;
        
        this.$emit('OnClick', item);
      },
      onHoverEvent: function(event, chartElement) {          
        
          if(this.cursor)
          {
            if(chartElement.length == 1)
             {
               event.native.target.style.cursor = 'pointer';
             }
             if(chartElement.length == 0)
             {
               event.native.target.style.cursor = 'default';
             }
          }
      }

    },
} 

</script>