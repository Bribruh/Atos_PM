//Required dependencies for Mongoose API
var mongoose = require('mongoose'); 
var morgan = require('morgan'); 
var argv = require('optimist').argv;

//Specified route(s) to access MongoDB for projects on VM

    //For GCP
    //var projConn = mongoose.createConnection('mongodb://' + argv.be_ip + ':80/AtosDB')

    //For Brian Local
    var projConn = mongoose.createConnection('mongodb://localhost:80/AtosDB')

    //For Andy Local
    //var projConn = mongoose.createConnection('mongodb://localhost:27017/ProjectDB');

    //For Seth Local
    //var projConn = mongoose.createConnection('mongodb://localhost:27017/ProjectDB');

//Project collection Names

    //For GCP and Brian Local
    var col = 'AtosProjects';
	var colR = 'AtosProjects.R';
	var colC = 'AtosProjects.C';

    //For Andy Local
    //var col = '';
	//var colR = '.R';

    //For Seth Local
    //var col = 'Project'
    //var colR = 'Project.R'
    //var colC = 'Project.C'

//Customized schema used for storing Project Resources

var Schema = mongoose.Schema;

var pSchema = new Schema({Project_Data:[{APN:'string',Lifecycle:'string',CNA_Ref_Num:'string',Name:'string',Initiative:'string',CNA_Sub_Portfolio:'string',CNA_Priority:'string',CNA_Request:'string',CNA_Country:'string',IDemand_Num:'string',Salesforce_Case:'string',Salesforce_Opportunity:'string',Created_By:'string',Created_At:'string',Last_Modified_At:'string',Modified_At:'string'}],Project_Description:[{Description:'string',Business_Justification:'string',CNA_Implement_Date:'string'}],CNA_Info:[{Requestor_Name:'string',Sponsor:'string',Architect:'string',Project_Manager:'string',Project_Contact:'string'}],ATOS_Assignment:[{Demand_Owner:'string',Assigned_To:'string',Program_Name:'string',Project_WBS_Code:'string',Solution_Architect:'string',SA_Assigned_Date:'string',Project_Manager:'string',PM_Assigned_Date:'string'}],Solution_Design_Info:[{Solution_Architect:'string',Complexity:'string',Difficulty:'string',Req_RAG_Status:'string',Req_Gathering_Start:'string',Req_Completion_Date:'string',Req_Sent_Approval:'string',Req_Sign_Date:'string',SD_RAG_Status:'string',SD_Completion_Date:'string',SD_Sign_Date:'string',Proposal_Version:'string',SA_Notes:'string',Peer_Reviewed:'string',Peer_Reviewer:'string',Peer_Reviewed_Date:'string',QA_Reviewed:'string',QA_Reviewer:'string',QA_Reviewed_Date:'string',Scope_Changed:'string',Scope_Change_Date:'string',Scope_Change_Num:'string',Days_Req_Gathering:'string',Days_Solution_Design:'string',Total_Days_Solutioning:'string'}],PM_Execution_Info:[{ATOS_PM:'string',Execution_Start_Date:'string',Execution_Days:'string',Planning_End_Date:'string',Baseline_Project_End_Date:'string',Baseline_Date_Change:'string',Project_End_Date:'string',Project_Percent:'string',Project_RAG_Status:'string',Scope_RAG:'string',Schedule_RAG:'string',Budget_RAG:'string',Baseline_Date:'string',Status_Date:'string',Status_Summary:'string',Executive_Summary:'string',Weekly_Highlights:'string',Upcoming:'string'}],Documentation:[{ATOS_PMO_URL:'string',Collab_URL:'string',Finance_URL:'string',Notes:'string',History:'string'}], V:'number'});
var pC = new Schema({count:'number'});


var Project = projConn.model(col,pSchema,col);
var ProjectR = projConn.model(colR,pSchema,colR);
var ProjectC = projConn.model(colC,pC,colC);

//Account collection Names

    //For GCP and Brian Local
    var acol = 'Account'

    //For Andy Local
    //var acol = '';

    //For Seth Local
    //var acol = 'Account'

//Customized schema used for storing Account Resources

var aSchema = new Schema({username:{type:String,required:true},password:{type:String,required:true},firstName:{type:String,required:true},lastName:{type:String,required:true},email:{type:String,required:true},role:{type:String},company:{type:String},date:{type:Date,default:Date.now}})

var Account = projConn.model(acol,aSchema,acol)

//Exports models for external use in Display.js

module.exports.Project = Project;
module.exports.ProjectR = ProjectR;
module.exports.ProjectC = ProjectC;
module.exports.Account = Account;
module.exports.mongoose = mongoose;
