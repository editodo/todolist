package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ls.gpis.dao.MenuDAO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.MenuItemDTO;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MenuService {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private MenuDAO menuDAO;

    //신규메뉴정보를 등록한다.
    public int insertMenu(MenuItemDTO menuItem)throws Exception
    {
        return menuDAO.insertMenu(menuItem);
    }

    //메뉴정보를 수정한다.
    public int updateMenu(MenuItemDTO menuItem)throws Exception
    {
        return menuDAO.updateMenu(menuItem);
    }

    //사용자 메뉴정보를 반환한다.(메인 메뉴트리용)
    public List<MenuDTO> selectMenuList(int up_menu_id, String UserID) throws Exception
    {
        List<MenuDTO> menulist = menuDAO.selectMenuList(up_menu_id, UserID);
        
        for (MenuDTO subMenu : menulist) {
            subMenu.setChildren(this.selectMenuList(subMenu.getId(), UserID));            
        }
        
        return menulist;
    }


    //현재 사용자의 메뉴의 권한 정보를 가져온다.
    public List<HashMap<String, Object>> selectAuthList(String UserID) throws Exception
    {
        return menuDAO.selectAuthList(UserID);        
    }
    
    //메뉴에 해당하는 권한이 있는지 결과를 반환한다.
    public boolean checkAuth(List<HashMap<String,Object>> menulist, int menu_id, int menu_level)
    {

        if(menulist == null) return false;  //권한 없음
        
        for (HashMap<String,Object> item : menulist) {

            if((int)item.get("MENU_ID") == menu_id &&
               (int)item.get("AUTH_LEVEL") >= menu_level) 
            {
                return true; //권한있음
            }             
        }

        return false;
    }


    //메뉴리스트를 반환(메뉴등록에서 사용)
    public List<MenuItemDTO> selectMenuList(int up_menu_id)throws Exception{

        List<MenuItemDTO> menulist = menuDAO.selectMenuList(up_menu_id);
        
        for (MenuItemDTO subMenu : menulist) {
            subMenu.children = this.selectMenuList(subMenu.MENU_ID);            
        }        
        return menulist;
    }


    //사용자 메뉴정보를 반환한다.(사용자 권한설정의 권한리스트용)
    public List<MenuDTO> selectAuthMenuList(int up_menu_id, String UserID) throws Exception
    {
        List<MenuDTO> menulist = menuDAO.selectAuthMenuList_id(up_menu_id, UserID);
        
        for (MenuDTO subMenu : menulist) {
            subMenu.setChildren(this.selectAuthMenuList(subMenu.getId(), UserID));            
        }        
        return menulist;
    }

    //사용자 메뉴정보를 저장
    public void updateUserAuthList(List<MenuDTO> menuList, String UserID) throws Exception
    {                
        for (MenuDTO subMenu : menuList) {
            menuDAO.updateAuthMenu(subMenu,UserID);
            
            if(subMenu.getChildren() != null) 
                this.updateUserAuthList(subMenu.getChildren(), UserID);            
        }        
    }

    //그룹의 메뉴정보를 반환한다(사용자 그룹 설정의 메뉴 정보)
    public List<MenuDTO> selectAuthMenuList_Group(int up_menu_id, String Group_ID) throws Exception
    {
        List<MenuDTO> menulist = menuDAO.selectAuthMenuList_Group(up_menu_id, Group_ID);
        
        for (MenuDTO subMenu : menulist) {
            subMenu.setChildren(this.selectAuthMenuList_Group(subMenu.getId(), Group_ID));            
        }        
        return menulist;
    }

	public List<MenuDTO> selectMenuSignList(int upMenuId, String empUserId) throws Exception {
        List<MenuDTO> menulist = menuDAO.selectMenuSignListByUserId(upMenuId, empUserId);
		for (MenuDTO subMenu : menulist) {
            subMenu.setChildren(this.selectMenuSignList(subMenu.getId(), empUserId));            
        }        
        return menulist;
	}
}