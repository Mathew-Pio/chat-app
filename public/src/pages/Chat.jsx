import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import axios from 'axios';import { useNavigate } from 'react-router-dom';
import { getAllUserRoutes } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
;

function Chat() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const redirect = async() => {
    if(!localStorage.getItem('chat-app-user')){
      navigate('/login');
    }else{
      setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
      setIsLoaded(true);
    }
  };
  redirect();
  },[]);

  // useEffect(() => {
  //   const checkUser = async() => {
  //     if(currentUser){
  //       if(currentUser.isAvatarImageSet){
  //         const data = await axios.get(`${getAllUserRoutes}/${currentUser._id};
  //         `)
  //         setContacts(data);
  //       }else{
  //         navigate('/setAvatar');
  //       }
  //     }
  //   }
  //   checkUser();
  // },[currentUser])

  useEffect(() => {
    const checkUser = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const response = await axios.get(`${getAllUserRoutes}/${currentUser._id}`);
            // Assuming the data you need is in response.data
            const userData = response.data;
  
            // Make sure userData.contacts is an array before setting it
            if (Array.isArray(userData.users)) {
              setContacts(userData.users);
            } else {
              console.error('Invalid contacts data received:', userData.users);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          navigate('/setAvatar');
        }
      }
    };
  
    checkUser();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {
          isLoaded && currentChat === undefined ? ( <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer currentChat={currentChat} />
          )
        }
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color:#00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width:720px) and (max-width:1080px){
      grid-temlate-columns: 35% 65%;
    }
  }
`;

export default Chat