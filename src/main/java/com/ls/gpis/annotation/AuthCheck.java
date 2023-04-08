package com.ls.gpis.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE,
        ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthCheck{

    public enum AuthLevel {
        NO_USE,             //사용안함
        READ,               //읽기권한
        WRITE,              //쓰기권한
        DELETE,             //삭제권한  
        APPROVA;            //승인권한

        public static AuthLevel fromInteger(int x) {
            switch(x) {
            case 0:
                return NO_USE;
            case 1:
                return READ;
            case 2:
                return WRITE;
            case 3:
                return DELETE;
            case 4:
                return APPROVA;
            }
            return null;
        }

    }

    public int MENU_ID() default -1;                    //권한 체크를 위한 메뉴 ID
    
    /*
    사용하기위한 최소 권한
    ex) DELETE로 설정후 
            실제 사용자가 갖고 있는 권한이 Write면 사용 불가
            실제 사용자가 갖고 있는 권한이 DELTE면 사용 가능
            실제 사용자가 갖고 있는 권한이 APPROVAL이면 사용 가능

        NO_USE로 설정 하면 누구든지 사용 가능
    */
    public AuthLevel LEVEL() default AuthLevel.NO_USE;  

}
