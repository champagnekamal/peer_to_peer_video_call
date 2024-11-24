import React from "react";

interface MessageProps {
  receivedmessage: string;
  selectedOption: any;
  setSelectedOption: (option: any) => void;
  options: any[];
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
  startcall: (option: any) => void;
}

const Message: React.FC<MessageProps> = ({
  startcall,
  receivedmessage,
  selectedOption,
  setSelectedOption,
  options,
  message,
  setMessage,
  sendMessage,
}) => {


const handlesetuser = (d:any)=>{
setSelectedOption(d)
}

console.log(selectedOption,"selectedOption");
  return (
    <>
    <div className="message_main">
    <div className="user-list">
      {
options?.map((e,i)=>
  <div className="user-item" key={i} onClick={()=>{handlesetuser(e);startcall(e)}}>
<div className="user-avatar">
  <img src="https://via.placeholder.com/50" alt="User 1"/>
</div>
<div className="user-info">
  <h3 className="user-name">{e?.label}</h3>
  {/* <p className="last-message">{e?.email }</p> */}
</div>
</div>)
      }
   

  </div>
      <div className="message_box">
        <span>received message:{receivedmessage}</span>
        <h2>This is Dashboard</h2>
        {/* <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        /> */}
        <input
          value={message}
          onChange={(e) => {
            setMessage(e?.target?.value);
          }}
          name=""
          id=""
        />
        <button onClick={sendMessage}>Submit Message</button>
      </div>
    </div>
   
    </>
  );
};

export default Message;
