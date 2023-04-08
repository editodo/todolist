package com.ls.gpis.util;

public class CommonUtil {


    //문자열에 값이 들어 있는지 확인
    //true : 값이 없다
    //flae : 값이 있다.
    public static boolean isNullOrEmpty(String str) {
        if (str == null) {
            return true;
        } else if (str.trim().isEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    
}
