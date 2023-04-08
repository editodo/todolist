package com.ls.gpis.web;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.FileDTO;
import com.ls.gpis.service.BoardService;
import com.ls.gpis.service.FileService;
import com.ls.gpis.service.LogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;



@AuthCheck(MENU_ID=8, LEVEL = AuthLevel.READ)
@RestController
//@CrossOrigin(value = {"*"}, exposedHeaders = {"Content-Disposition"})
@RequestMapping("/reference")
public class ReferenceController {
    
    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private BoardService boardService;

    @Autowired
    private FileService fileService;    

    @Autowired
    private LogService logService;
    
    private int b_id = 3;   //게시판ID

    //게시물을 등록 한다.
    @AuthCheck(MENU_ID=8, LEVEL = AuthLevel.WRITE)
    @RequestMapping("/insertBoardData")
    public int insertBoardData(HttpServletRequest request    
                                ,@RequestParam("FILES[]") MultipartFile[] files         //파일정보
                                ,@RequestParam("TITLE") String Title                    //제목
                                ,@RequestParam("CONTENTS") String Contents              //내용
                                )throws Exception{

        //로그인 정보(토큰)를 바탕으로 작성자 정보를 생성한다.
        String UserID = request.getAttribute("UserID").toString();

        HashMap<String, Object> boardData = new HashMap<String, Object>();
        boardData.put("TITLE", Title);
        boardData.put("CONTENTS", Contents);
        boardData.put("CREATER", UserID);

        return boardService.insertBoardContesntsFile(boardData, b_id, files);

    }

    //게시물 리스트를 반환한다.
    @RequestMapping("/selectBoardList")
    public List<HashMap<String, Object>> selectBoardList(
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {

        //int bid = (int)map.get("B_ID");
        
        return boardService.selectBoardList(b_id);
    }


    //게시물을 반환
    @RequestMapping("/selectBoardContents")
    public HashMap<String, Object> selectBoardContents(
        @RequestBody HashMap<String, Object> map)throws Exception{
        
        
        int cid = Integer.parseInt(map.get("cid").toString());
        
        return boardService.selectBoardContents(cid, b_id);
    }

    //axios형식으로 파일 다운로드
    @RequestMapping("/axiosDownload")
    public ResponseEntity<ByteArrayResource> axiosDownload(@RequestBody HashMap<String, Object> map)throws Exception{
        
        
        String uuid = map.get("UUID").toString();

        FileDTO fd = fileService.selectFile(uuid);  //파일 정보를 가져온다.

        String primaryType, subType;
        primaryType = fd.getMIMETYPE().split("/")[0];
        subType = fd.getMIMETYPE().split("/")[1];
        ByteArrayResource resource = new ByteArrayResource(fd.getFILE());        

        String filename = fd.getFILENAME(); //한글 깨짐 방지
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < filename.length(); i++) {
            char c = filename.charAt(i);
            if (c > '~') {
                    sb.append(URLEncoder.encode("" + c, "UTF-8"));
            } else {
                    sb.append(c);
            }
        }
        String encodedFilename = sb.toString();

        //String filename = new String(fd.getFILENAME().getBytes("UTF-8"), "UTF-8"); //한글 깨짐 방지
        //String filename = fd.getFILENAME(); //한글 깨짐 방지
        

        // HttpHeaders responseHeaders = new HttpHeaders();
        // responseHeaders.set(HttpHeaders.CONTENT_DISPOSITION, 
        // "attachment;filename=" +encodedFilename);

        /* 
        ContentDisposition contentDisposition = ContentDisposition.builder("inline")
          .filename(encodedFilename)
          .build();

    HttpHeaders headers = new HttpHeaders();
      headers.setContentDisposition(contentDisposition);
        */
          

        return ResponseEntity.ok()
        // Content-Disposition
        //.header("Baeldung-Example-Header", "Value-Handler")
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" +encodedFilename )
        //.headers(headers)
        //.header(HttpHeaders.CON, filename )
        // Content-Type        
        .contentType(new MediaType(primaryType, subType)) //
        // Content-Lengh
        .contentLength(fd.getFILE().length) //
        .body(resource);
    }



     //게시물을 삭제
     @AuthCheck(MENU_ID=8, LEVEL = AuthLevel.DELETE)     //삭제권한이 있는지 체크
     @RequestMapping("/deleteBoardContents")
     public CommonDTO deleteBoardContents(HttpServletRequest request, 
                                         @RequestBody HashMap<String, Object> ContentsInfo)throws Exception
     {    
         try{
             
             int cid = Integer.parseInt(ContentsInfo.get("CONTENTS_ID").toString()); //게시물 ID를 가져온다.
             return boardService.deleteBoardContents(request, ContentsInfo, cid, b_id);
 
         }catch (Exception e) {
             logService.insertErrorLog(request, e);            
             return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
         }
     }

     


    // Download a file
    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<ByteArrayResource> downloadFile(@RequestParam("UUID") String uuid)throws Exception{
        
        FileDTO fd = fileService.selectFile(uuid);  //파일 정보를 가져온다.

        String primaryType, subType;
        primaryType = fd.getMIMETYPE().split("/")[0];
        subType = fd.getMIMETYPE().split("/")[1];
        ByteArrayResource resource = new ByteArrayResource(fd.getFILE());


        String filename = fd.getFILENAME(); //한글 깨짐 방지
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < filename.length(); i++) {
            char c = filename.charAt(i);
            if (c > '~') {
                sb.append(URLEncoder.encode("" + c, "UTF-8"));
            } else {
                sb.append(c);
            }
        }

        String encodedFilename = sb.toString();
        
        //String Filename = new String(fd.getFILENAME().getBytes("UTF-8"), "ISO-8859-1"); //한글 깨짐 방지
        
        
        return ResponseEntity.ok()
        // Content-Disposition
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" +encodedFilename )
        // Content-Type
        .contentType(new MediaType(primaryType, subType)) //
        // Content-Lengh
        .contentLength(fd.getFILE().length) //
        .body(resource);
    }


     //게시물을 수정한다.
     @AuthCheck(MENU_ID=8, LEVEL = AuthLevel.WRITE)     //작성 권한이 있는지 체크
     @RequestMapping("/updateBoardContents")
     public CommonDTO updateBoardContents(HttpServletRequest request, 
                                         @RequestBody HashMap<String, Object> ContentsInfo)throws Exception
     {    
         try{            
             int cid = Integer.parseInt(ContentsInfo.get("CONTENTS_ID").toString()); //게시물 ID를 가져온다.
             return boardService.updateBoardContents(request, ContentsInfo, cid, b_id);
 
         }catch (Exception e) {
             logService.insertErrorLog(request, e);            
             return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
         }        
     }



}

