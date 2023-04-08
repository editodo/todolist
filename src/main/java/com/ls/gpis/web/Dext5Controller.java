//dext5editor/handler/upload_handler.jsp

package com.ls.gpis.web;

import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.service.BoardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.dext5.DEXT5Handler;

@RestController
@RequestMapping("/dext5editor")
public class Dext5Controller {

    protected Log log = LogFactory.getLog(this.getClass());

    @RequestMapping("/handler/upload_handler.jsp")
    public void insertBoardData(HttpServletRequest request, HttpServletResponse response) throws Exception {

        DEXT5Handler DEXT5 = new DEXT5Handler();

        String _allowFileExt = "gif, jpg, jpeg, png, bmp, wmv, asf, swf, avi, mpg, mpeg, mp4, txt, doc, docx, xls, xlsx, ppt, pptx, hwp, zip, pdf,flv";
        int upload_max_size = 2147483647;
        ServletContext application =  request.getSession().getServletContext();


        String[] allowUploadDirectoryPath = { request.getSession().getServletContext().getRealPath("/") };
        DEXT5.SetAllowUploadDirectoryPath(allowUploadDirectoryPath);

        String result = DEXT5.DEXTProcess(request, response, application, _allowFileExt, upload_max_size);

        response.setContentType("text/html");
		ServletOutputStream out = response.getOutputStream();
		out.print(result);
        out.close();
        
    }



}


