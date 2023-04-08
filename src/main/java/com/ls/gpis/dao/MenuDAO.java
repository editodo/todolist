package com.ls.gpis.dao;

import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;

import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.MenuItemDTO;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Repository
public class MenuDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired 
    protected SqlSessionTemplate sqlSession;

    //신규 메뉴정보를 등록한다
    public int insertMenu(MenuItemDTO menuItem)throws Exception
    {
      return sqlSession.insert("com.ls.gpis.framework.menu.insertMenu", menuItem);
    }


    //메뉴정보를 수정한다.
    public int updateMenu(MenuItemDTO menuItem)throws Exception
    {
      return sqlSession.update("com.ls.gpis.framework.menu.updateMenu", menuItem);
    }

    //메뉴 리스트를 반환한다.
    public List<MenuItemDTO> selectMenuList(int up_id)throws Exception
    {
      return sqlSession.selectList("com.ls.gpis.framework.menu.selectMenuList", up_id);
    }    

    //등록된 메뉴 정보를 가져온다.    
    public List<MenuDTO> selectMenuList(int up_id, String UserID) throws Exception
    {
        HashMap<String,Object> param = new HashMap<String,Object>();
        param.put("UP_MENU_ID", up_id);
        param.put("LOGIN_ID", UserID);

        return sqlSession.selectList("com.ls.gpis.framework.menu.selectAuthMenuList", param);
        //return sqlSession.selectOne("com.ls.gpis.framework.user.selectUser", param);    
    }


      //현재 사용자의 메뉴의 권한 정보를 가져온다.
      public List<HashMap<String, Object>> selectAuthList(String UserID) throws Exception
      {  
        return sqlSession.selectList("com.ls.gpis.framework.menu.selectAuthList", UserID);
      }

      //현재 사용자의 메뉴의 권한 정보를 가져온다.
      public List<MenuDTO>  selectAuthMenuList_id(int up_id, String UserID) throws Exception
      {  
        HashMap<String,Object> param = new HashMap<String,Object>();
        param.put("UP_MENU_ID", up_id);
        param.put("EMP_USER_ID", UserID);

        return sqlSession.selectList("com.ls.gpis.framework.menu.selectAuthMenuList_id", param);
      }

      //특정 그룹의 메뉴 권한정보를 반환한다.
      public List<MenuDTO> selectAuthMenuList_Group(int up_id, String GROUP_ID) throws Exception
      {  
        HashMap<String,Object> param = new HashMap<String,Object>();
        param.put("UP_MENU_ID", up_id);
        param.put("GROUP_ID", GROUP_ID);

        return sqlSession.selectList("com.ls.gpis.framework.menu.selectAuthMenuList_Group", param);
      }

      //메뉴 권한 정보를 업데이트 한다.      
      public int updateAuthMenu(MenuDTO menuItem, String UserID) throws Exception
      {
        HashMap<String,Object> param = new HashMap<String,Object>();
        
        param.put("AUTH_LEVEL", menuItem.getAuth_level());
        param.put("EMP_USER_ID", UserID);
        param.put("MENU_ID", menuItem.getId());

        return sqlSession.update("com.ls.gpis.framework.menu.updateAuthLevelMenu", param);
      }


	public List<MenuDTO> selectMenuSignListByUserId(int upMenuId, String empUserId) throws Exception {
    HashMap<String,Object> param = new HashMap<String,Object>();
        param.put("upMenuId", upMenuId);
        param.put("empUserId", empUserId);

        return sqlSession.selectList("com.ls.gpis.framework.menu.selectMenuSignListByUserId", param);
	}


}