<style scoped>

  .pms-file-list-attach-td {
    border-right: none !important;
  }


  .pms-file-list-box label {
    display: inline-block;
    padding: 0 4px;
    height: 22px;
    width: 70px;
    text-align: center;
    color: #0d1cee;
    font-size: inherit;
    line-height: 22px;
    vertical-align: middle;
    background-color: #fdfdfd;
    cursor: pointer;
    border: 1px solid #4596bb;
    border-bottom-color: #4596bb;
    border-radius: 4px;
  }
  .pms-file-list-box input[type="file"] {
    /* 파일 필드 숨기기 */
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .pms-file-list-td,
  .pms-file-list-attach-td {
    border-right : none !important;
    border-bottom : none !important;
  }

  .pms-file-list-td span {    
    font-size:12px;        
  }

  .pms-file-list-attach-td span {
    color : #0000ff;
    cursor:pointer;
    text-decoration: underline;
    font-size:12px;      
  }
  


</style>


<template>
  <div>   
    <v-layout>
      <div
        
        :width="getWidth"
        @drop.prevent="dragAndDrogFile($event)"
        @dragover.prevent
      >
        <v-simple-table
          dense
          clas="pms-file-list-tb"
        >
          <template v-slot:default>
            <tbody v-if="newDisplayList.length > 0">
              <tr
                v-for="item in newDisplayList"
                :key="item.FILE_NM"
              >
                <td
                  v-if="item.FILE_ID == null || item.FILE_ID == ''"       
                  class="pms-file-list-td"         
                >
                  <span>{{ item.FILE_NM }} ({{ getfileSize(item.SIZE) }})</span>
                  <v-btn
                    v-if="!disabled"
                    icon             
                    height="20"       
                  >
                    <v-icon
                      color="red"
                      small                      
                      @click.stop="deleteFileAttach(item)"
                    >
                      clear
                    </v-icon>
                  </v-btn>
                </td>
                <td
                  v-else
                  class="pms-file-list-attach-td"
                  @click="downloadFileAttach(item)"
                >
                  <span>
                    {{ item.FILE_NM }} ({{ getfileSize(item.SIZE) }})
                  </span>                  
                  <v-btn
                    v-if="!disabled"
                    icon             
                    height="20"       
                  >
                    <v-icon
                      color="red"
                      small                      
                      @click.stop="deleteFileAttach(item)"
                    >
                      clear
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td
                  spancol="3"
                  style="font-size:12px;border-right:none;"
                >
                  파일이 없습니다.
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <div
        v-show="!disabled"
        class="width:80px;"
      >
        <div
          v-if="!disabled"
          class="pms-file-list-box"
          style="margin-top:2px;"
        >
          <label
            :for="btnid"
            class="float-right"
          >추가</label>
          <input
            :id="btnid"
            type="file"
            multiple
            class="upload-hidden"
            @change="inputAndButtonFile()"
          >
        </div>
      </div>
    </v-layout>
  </div>
</template>

<script>
import CONST from "@/const";
import axios from "axios";



export default {
    components: {      
      
    },
    props: {
      btnid:{type:String, default:''},
      disabled:{type:Boolean, default:false},      
      grpid:{type:Number, default:0},
      downloadlisturl:{type:String, default:''},    //전체리스트 다운로드 url
      downloaditemurl:{type:String, default:''},    //각각의 첨부파일 다운로드 url
      deleteurl:{type:String, default:''},      
    },
    data: () => ({

      newDisplayList : [],
      newUploadList : [],      
    }),
    watch : {
      grpid() {
        this.downloadFileAttachAllList();
      }
    }, 
    created : function() {
    },
    mounted: function() {
      this.downloadFileAttachAllList();
    },
    methods:{
      downloadFileAttachAllList : function() {
        console.log("downloadFileAttachList");
        if(typeof this.grpid == 'undefined' || this.grpid == 0 || isNaN(this.grpid)) return;
        console.log("downloadFileAttachList : " + this.grpid);
        return axios.post(`${CONST.HOST_ADDR}${this.downloadlisturl}`, {FILE_SNO:this.grpid})
          .then(ret => {
            console.log(ret.data);
            console.log("downloadFileAttachList  : " + JSON.stringify(ret.data));
            this.newDisplayList = ret.data;
          })
          .catch(ex => {
            console.log(ex);
          });
      },
      downloadFileUrl: function(item){

        let url = `${CONST.HOST_ADDR}${this.downloaditemurl}` + "?FILE_ID=" + item.FILE_ID;

       
        return url;        
      },    
      downloadFileAttach : function(item) {
        console.log(item);
        return axios.get(`${CONST.HOST_ADDR}${this.downloaditemurl}` + "?FILE_ID=" + item.FILE_ID, {responseType:'blob'}).then(response => {

          console.log(response+response.data.type);

          let blob = new Blob([response.data], {type: response.headers['content-type']});
          let fileName = this.getFileName(response.headers['content-disposition']);
          fileName = decodeURI(fileName);

          if(response.data.type=="application/pdf"){
            var newWin = window.open(window.URL.createObjectURL(blob));
            newWin.focus();
            newWin.reload();
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.target = '_self';
            link.download = fileName;
            link.click();
          }

          //  let link = document.createElement('a');
          //   link.href = window.URL.createObjectURL(blob);
          //   link.target = '_new';
          //   link.download = fileName;
          //   link.click();
          

          // const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
          // const link = document.createElement('a');
          // link.href = url;
          // link.setAttribute('download', 'test.xlsx');
          // document.body.appendChild(link);
          // link.click();
          })
          .catch(ex => {
            console.log(ex);
          });
      },
      deleteFileAttach : function(item) {
        if(item.FILE_ID == null || item.FILE_ID == '') {
          this.deleteDisplayFileAttach(item);          
        } else {
          this.deleteServerFileAttach(item);          
        }
      },
      deleteServerFileAttach : async function(item) {
        if ((await this.$root.$confirm.open("Confirm", "첨부파일을 삭제하시겠습니까?", { color: "primary" })) == false)
          return;  

        return axios.post(`${CONST.HOST_ADDR}${this.deleteurl}`, item)
          .then(ret => {
            console.log("deleteFileAttach  : " + JSON.stringify(ret.data));

            const index = this.newDisplayList.indexOf(item);
            this.newDisplayList.splice(index, 1);
          })
          .catch(ex => {
            console.log(ex);
          });
      },
      deleteDisplayFileAttach: function(item) {
        //화면에서 삭제
        const index = this.newDisplayList.indexOf(item);
        this.newDisplayList.splice(index, 1);

        //첨부리스트에서 삭제
        const delArr = this.newUploadList.filter(elm => {
          console.log(elm);
          if (item.FILE_NM == elm.name && item.SIZE == elm.size) {
            return elm;
          }
        });

        if (delArr != null && delArr.length > 0) {
          const delIndex = this.newUploadList.indexOf(delArr[0]);
          this.newUploadList.splice(delIndex, 1);
        }
      },

      getfileSize: function(x) {
        if(x == null || x == '') return '0KB';
        var s = ["bytes", "KB", "MB", "GB", "TB", "PB"];
        var e = Math.floor(Math.log(x) / Math.log(1024));
        return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
      },

      addFile: function(files) {
        console.log('addFile');
        console.log(files);
        // var files = document.getElementById('ex_file').files;

        var fileBuffer = [];
        Array.prototype.push.apply(fileBuffer, files);

        if (this.newUploadList.length == 0) {
          Array.prototype.push.apply(this.newUploadList, files);
        } else {
          fileBuffer.forEach(item => {
            var dup = this.newUploadList.some(function(base) {
              if (base.size === item.size && item.name == base.name) {
                return base;
              }
            });
            if (!dup) {
              this.newUploadList.push(item);
            }
          });

          console.log("this.newUploadList.length : " + this.newUploadList.length);
        }

        fileBuffer.forEach(item => {
          var dup = this.newDisplayList.some(function(base) {
            if (base.size === item.size && item.name == base.name) {
              return base;
            }
          });
          if (!dup) {
            this.newDisplayList.push({
              FILE_NM : item.name,
              SIZE : item.size,
              SNO : 0,              
              FILE_ID : '',
            });
          }
        });
      },
      inputAndButtonFile: function() {
        const files = document.getElementById(this.btnid).files;
        if (files.length > 0) {
          this.addFile(files);
        } else {
          console.log("files.length : " + files.length);
        }
        //버튼 초기화
        document.getElementById(this.btnid).value = "";
      },
      dragAndDrogFile: function(event) {
        if(this.disabled) return;
        console.log("e.dataTransfer.files.length : " + event.dataTransfer.files.length);
        const files = event.dataTransfer.files;
        if (files.length > 0) {
          this.addFile(files);
        } else {
          console.log("files.length : " + files.length);
        }
      },
      getAttachFileUploadList : function() {
        return this.newUploadList;
      },
      getAttachFileDisplayList : function() {
        return this.newDisplayList;
      },
      getAttachFileDeleteList : function() {
        return this.newUploadList;
      }, 
      deleteAllAttachFileUploadList : function() {
        this.newUploadList = [];
      },
      getFileName : function (contentDisposition) {
        console.log(contentDisposition);
        let fileName = contentDisposition
          .split(';')
          .filter((ele) => {
            return ele.indexOf('filename') > -1
          })
          .map((ele) => {
            return ele.replace(/"/g, '').split('=')[1]
        })
        return fileName[0] ? fileName[0] : null
      },
      getWidth : function() {
        if(this.disabled) {
          return 'calc(100% - 80px)';
        } else {
          return 'calc(100% - 5px)';
        }
      }

    },
}
</script>


