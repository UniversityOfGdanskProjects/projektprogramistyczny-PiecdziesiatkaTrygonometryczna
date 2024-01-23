const Chat = ({descendingOrderMessages}) => {
    return (
        <>
            <div>
         {descendingOrderMessages.map((message, _index) => (
        <div key={_index}>
         <div>
          <div>
            <img className="icon" src={message.img} alt={message.name + ' profile'} style={{width: '20px', height: '20px'}}/>
            </div>
       <p>{message.name}</p>
     </div>
           <p>{message.message}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Chat