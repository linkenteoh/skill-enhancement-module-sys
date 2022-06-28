
module.exports = ({ user, serialno, icno, certId, modules, url }) => {
return `
<!doctype html>
<html>
    <head>
       <meta charset="utf-8">
       <style>
          .container {
             max-width: 800px;
             height: 980px;
             position: relative;
             margin: auto;
             padding: 60px 60px 50px 60px;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
          }
 
          .header{
              margin-top: 0px;
              margin-bottom: 30px;
              letter-spacing: 1.2px;
              font-weight: 300;
          }
 
          .img-wrapper{
              text-align: center;
          }
 
          .img-wrapper img{
              width: 280px;
              margin-bottom: 50px;
          }
 
          .name{
              margin-top: 200px;
              font-size: 24px;
          }
 
          .content{
              text-align: center;
          }
 
          .footer{
              font-size: smaller;
              text-align: center;
              position: absolute;
              bottom: 15px;
          }

          .footer .span{
              text-align: center;
          }
 
          .header-container{
              display: flex;
              display: -webkit-box;
              -webkit-justify-content: space-between;
              justify-content: space-between;
              margin-bottom: 30px;
          }
 
          li{
              font-size: 20px;
              margin-bottom: 3px;
          }
       </style>
    </head>
    <body>
       <div class="container">
           <div style="float:right">
             <span>SN:${certId}</span>
           </div>
           <div class="header-container">
             <h3 class="header">KOLEJ UNIVERSITI TUNKU ABDUL RAHMAN</h3>
           </div>
           <div class="img-wrapper">
              <img src="https://www.tarc.edu.my/files/tarc/95DA52FE-4486-41EA-8E9E-2358E2E0BFE4.png">
           </div>
         
           <div class="content">
             <h2>CERTIFICATE OF COMPLETION</h2>
             <span>It is hearby certified that</span><br/>
             <strong class="name">${user.name.toUpperCase()}</strong><br/>
             <span>(${user.icNo})</span><br/>
             <span>has completed all the skills enhancement modules throughout his/her academic years as stated below: </span><br/><br/>
             ${modules}
             <br/>
             <br/>
 
             <br/>
             <br/>
             <br/>
             <br/>
             <br/>
             <br/>
             
             
             <img src="${url}"/>
           </div>

           <div style="" class="footer">
            <span><b>TUNKU ABDUL RAHMAN UNIVERSITY COLLEGE</b> is registered under the Private Higher Education Act 1996 (Act 555)</span>
            </div>
       </div>
    </body>
 </html>
    `;
};