package com.ls.gpis.dto;

import java.util.List;

public class MenuItemDTO{
    public int MENU_ID;
    public String MENU_NAME;
    public int UP_MENU_ID;
    public String MENU_URL;
    public int ORDER_NO;
    public String ACTV;
    public String MENU_ICON;
    public String CREATED_DATE;
    public String CREATER_ID;

    public List<MenuItemDTO> children;     //하위메뉴 정보
}
