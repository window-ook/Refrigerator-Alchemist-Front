import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IP_ADDRESS } from '../../context/UserContext';
import { handleError } from '../../utils/customedError';
import { toast } from 'react-toastify';
import { CiSaveDown2 } from 'react-icons/ci';
import axios from 'axios';
import TagInput from '../../components/gpts/TagInput';
import Loading from '../../components/common/Loading';
import BackButton from '../../components/common/BackButton';

const GptSearch = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const nickName = localStorage.getItem('nickName') || '';

  const handleNextButtonClick = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        당`${IP_ADDRESS}/recipe/recommend`,
        {
          ingredients: tags,
        },
        {
          headers: {
            'Authorization-Access': accessToken,
          },
        }
      );

      console.log('서버 응답:', response.data);
      const recommendId = response.data;
      if (recommendId) {
        navigate(`/recipe/recommend/${recommendId}`);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="bg-white min-h-screen px-4 py-8 flex flex-col relative">
      <BackButton destination="/main" />
      <main className="max-w-lg mx-auto flex-1">
        <h2 className="font-jua text-xl md:text-2xl font-bold mb-12 mt-32 text-center">
          냉장고에서 꺼내 넣어주세요!
        </h2>
        <TagInput tags={tags} setTags={setTags} />
      </main>
      <footer className="w-full max-w-xs mx-auto pb-8">
        <button
          className="flex justify-center items-center font-jua transition ease-in-out delay-150 text-black text-md md:text-2xl bg-white hover:bg-white hover:scale-125 hover:cursor-pointer font-bold py-2 px-4 rounded w-full mb-4"
          type="button"
          onClick={() => {
            if (!accessToken) {
              toast.error('로그인이 필요합니다.');
            } else {
              navigate('/recipe/myRecipe');
            }
          }}
        >
          <CiSaveDown2 className="mr-1 w-6 h-6" />
          {accessToken ? `${nickName}의 레시피 기록 열기` : '레시피 기록 열기'}
        </button>
        <button
          className="font-jua text-xl transition ease-in-out bg-main hover:bg-emerald hover:scale-110 hover:cursor-pointer hover:text-black text-white font-bold py-3 px-4 rounded-md w-full"
          type="button"
          onClick={handleNextButtonClick}
        >
          레시피 나와라 얍!
        </button>
      </footer>
    </section>
  );
};

export default GptSearch;
