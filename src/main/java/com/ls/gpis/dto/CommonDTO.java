package com.ls.gpis.dto;

import java.util.HashMap;
 

 public class CommonDTO{
    
    private Boolean ret;          //결과
    private String msg;          //에러 메시지
    private HashMap<String,Object> data; //데이터

    //생성자(초기화 한다.)
    public CommonDTO(){
        this.ret = false;
        this.msg = "";
        this.data = null;
    }
    
    public CommonDTO(boolean Ret, String Msg){
        this.ret = Ret;
        this.msg = Msg;
    }

    public Boolean getRet() {
        return ret;
    }

    public void setRet(Boolean ret) {
        this.ret = ret;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public HashMap<String, Object> getData() {
        return data;
    }

    public void setData(HashMap<String, Object> data) {
        this.data = data;
    }

}