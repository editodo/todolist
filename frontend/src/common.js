
//공통 함수를 등록한다.
import CONST from '@/const'
import axios from 'axios'

export default{
    install(Vue){

        //사용자 정보를 반환 : 성명(ID) 형태로 반환
        Vue.prototype.$GET_USER_NAME_ID = function (EMP_USER_ID){
            
            if(EMP_USER_ID === undefined || EMP_USER_ID == '') return '';
            if(this.$store.getters.GET_USER_LIST_INFO[EMP_USER_ID] == undefined) return EMP_USER_ID;

            var UserName = this.$store.getters.GET_USER_LIST_INFO[EMP_USER_ID].EMP_NAME;

            if(UserName === undefined) return "";
            var setVal = UserName + '(' + EMP_USER_ID + ')';
            return setVal;
        }

        //엑셀파일을 다운로드 받는다.
        Vue.prototype.$GET_EXCEL_FILE = function (headers, Data){

            var ExcelData = {
                'Header':headers,
                'Data': Data,
                };

            axios.post(`${CONST.HOST_ADDR}/Common/ExcelDownload`, ExcelData, {responseType: "blob"}).then(
            (ret)=>{                       

                function getFileName(contentDisposition) {
                    let fileName = contentDisposition
                    .split(';')
                    .filter((ele) => {
                        return ele.indexOf('filename') > -1
                    })
                    .map((ele) => {
                        return ele
                        .replace(/"/g, '')
                        .split('=')[1]
                    })
                    return fileName[0] ? fileName[0] : null
                }

                const url = window.URL.createObjectURL(new Blob([ret.data], { type: ret.data.type }))
                const link = document.createElement('a');
                link.href = url;

                const filename = getFileName(ret.headers['content-disposition']);
                link.setAttribute('download', decodeURI(filename))
                document.body.appendChild(link)
                link.click()

                }
            );       
            
        }

    }
}
