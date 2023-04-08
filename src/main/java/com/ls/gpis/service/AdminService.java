package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

import com.ls.gpis.dao.GroupDAO;
import com.ls.gpis.dto.MenuDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


//관리자 권한등록에 필요한 서비스
@Service
public class AdminService {

    Logger logger = LoggerFactory.getLogger(this.getClass());
    
    @Autowired
    private GroupDAO groupDAO;
    

    @Transactional
    public int updateGroupAuthList(List<MenuDTO> menuList, int GROUP_ID) throws Exception
    {
        for (MenuDTO subMenu : menuList) {
            groupDAO.updateGroupAuthLevelMenu(subMenu,GROUP_ID);
            
            if(subMenu.getChildren() != null) 
                this.updateGroupAuthList(subMenu.getChildren(), GROUP_ID);            
        }        
        
        return 0;
    }


    //특정 그룹의 사용자 정보를 갱신한다.
    @Transactional
    public int updateGroupUserList(int GROUP_ID, String CREATER_ID, List<HashMap<String, Object>> UserList)
            throws Exception
    {
        groupDAO.deleteGroupUserList(GROUP_ID); //특정 그룹정보를 삭제한다.

        

        for (HashMap<String, Object> item : UserList) {
            item.put("GROUP_ID", GROUP_ID);
            item.put("CREATER_ID", CREATER_ID);
            groupDAO.insertGroupUserList(item);   //그룹정보를 추가한다.         
        }        

        return 0;
    }
    
    //현재 등록된 그룹 관련 정보를 반환한다.
    public List<HashMap<String, Object>> selectGroupList()
    {
        return groupDAO.selectGroupList();
    }

    //특정 그룹의 사용자 리스트를 반환한다.
    public List<HashMap<String, Object>> selectGroupUserList(String GroupID)
    {
        return groupDAO.selectGroupUserList(GroupID);
    }

    //신규 그룹정보를 추가한다.
    public int insertNewGroup(HashMap<String,Object> data){
        return groupDAO.insertNewGroup(data);
    }

    //그룹정보를 수정한다.
    public int updateGroup(HashMap<String,Object> data){
        return groupDAO.updateGroup(data);
    }

    //그룹정보를 삭제한다.
    public int deleteGroup(HashMap<String,Object> data){
        return groupDAO.deleteGroup(data);
    }
}


