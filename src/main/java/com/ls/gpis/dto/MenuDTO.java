package com.ls.gpis.dto;

import java.util.List;

public class MenuDTO{

    private int id;                     //id
    private String name;                //메뉴명
    private String icon;                //메뉴 Icon명    
    private int auth_level;             //메뉴 권한.    
    private String url;                 //메뉴 URL
    private List<MenuDTO> children;     //하위메뉴 정보
    private int sign_id;                //메뉴별 결제라인 정보

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getAuth_level() {
        return auth_level;
    }

    public void setAuth_level(int auth_level) {
        this.auth_level = auth_level;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<MenuDTO> getChildren() {
        return children;
    }

    public void setChildren(List<MenuDTO> children) {
        this.children = children;
    }

    public int getSign_id() {
        return sign_id;
    }

    public void setSign_id(int sign_id) {
        this.sign_id = sign_id;
    }



}