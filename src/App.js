import axios from 'axios';
import './App.css';
import { useMutation, useQueries, useQuery } from 'react-query';
import { useEffect, useState } from 'react';

// HTTP GET 요청을 통해 게시물 데이터 한개 가져옴
const fetchData = async () => {
  try {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

// HTTP GET 요청을 통해 게시물 리스트데이터 가져옴
const fetchListData = async () => {
  try {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

//Post 요청을 통해 데이터 보냄
const PostData = async () => {
  try {
    const headers = {
      'Content-type': 'application/json; charset=UTF-8',
    }

    const data = {
      title: "제목",
      body: "내용",
      userId: 100,
    }

    return await axios.post("https://jsonplaceholder.typicode.com/posts", data, {
      headers: headers,
    })
  } catch (error) {
    throw new Error("Failed to post data");
  }
}

function App() {

  // 게시물데이터 1개
  const [post, setPost] = useState(null);
  useQuery("post", fetchData, {
    onSuccess: (data) => setPost(data),
    onError: (error) => {
      console.error("에러", error);
      setPost({ title: "제목없음", body: "내용없음" });
    }
  })

  //게시물 리스트 데이터
  const [postList, setPostList] = useState(null);
  const { data, isLoading, isError } = useQuery(["postList"], fetchListData);

  // POST 요청
  const { mutate } = useMutation(() => PostData(), {
    onSuccess: (data) => {
      console.log('성공', data);
    },
    onError: (error) => {
      console.error(error);
    }
  })

  useEffect(() => {
    if (data) {
      setPostList(data);
    }
  }, [data, setPostList]);

  // post 요청
  const mutate2 = useMutation(() => PostData());

  // 로딩중 (게시물 리스트 데이터)
  if (isLoading) {
    return <div>로딩중</div>
  }

  if (isError) {
    return <div>데이터 가져오기 실패</div>
  }





  // 로딩
  if (mutate2.isLoading) {
    return <div>mutation 로딩 중</div>
  }

  // 에러
  if (mutate2.isError) {
    return <div>mutation 실패</div>
  }

  // 성공
  if (mutate2.isSuccess) {
    console.log(mutate2.data);
    return <div>성공</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => mutate()}>POST 버튼</button>
      </div>
      <div>
        <button onClick={() => mutate2.mutate()}>POST 버튼2</button>
      </div>


      {
        post && (
          <ul>
            <h1>게시물 한개</h1>
            <li>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          </ul>
        )
      }

      {
        postList && (
          <ul>
            <h1>게시물 여러개</h1>
            {postList.map((post =>
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}

export default App;
