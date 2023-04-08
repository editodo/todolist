package com.ls.gpis.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

//해당 어노테이션이 있다면 로그인하지 않으면 컨트롤러가 작동하지 않음
@Target({ElementType.TYPE,
    ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface LoginCheck{


}