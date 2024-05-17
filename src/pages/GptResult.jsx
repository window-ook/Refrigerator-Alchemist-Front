import React, { useState, useEffect } from 'react';
import { GoHome } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IP_ADDRESS, useUserDispatch } from '../context/UserContext';
import axios from 'axios';
import Loading from '../components/gpt/Loading';
import BackButton from '../components/ui/BackButton';

const GptResult = () => {
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { recommendId } = useParams();
  const accessToken = localStorage.getItem('accessToken');

  const navigate = useNavigate();
  const { handleError } = useUserDispatch();

  // 🤖 GPT 레시피 결과 불러오는 함수
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${IP_ADDRESS}/recipe/recommend/${recommendId}`,
          {
            headers: {
              'Authorization-Access': accessToken,
            },
          }
        );

        if (response.data) {
          setTitle(response.data.foodName);
          setIngredients(response.data.ingredients);
          setSteps(response.data.recipe);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (recommendId) {
      fetchData();
    }
  }, [recommendId, accessToken, handleError]);

  // gpt레시피 저장하기
  const handleSaveButtonClick = async () => {
    try {
      await axios.post(
        `${IP_ADDRESS}/recipe/save`,
        {
          foodName: title,
          ingredients: ingredients,
          recipe: steps,
        },
        {
          headers: {
            'Authorization-Access': accessToken,
          },
        }
      );
      toast.success('레시피가 성공적으로 저장되었습니다.');
      navigate('/recipe/myRecipe');
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="bg-white min-h-screen px-4 py-6">
      <BackButton destination="/main" />
      <main className="max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-lg">
        <div className="md:flex">
          <div className="w-full p-4 pt-12">
            <div className="border-b-2 border-gray-100 py-2">
              <h1 className="m-4 tfont-score text-3xl font-bold text-gray-800 text-center">
                {title}
              </h1>
            </div>
            <div className="mt-8 recipebox p-4 bg-gray-100 rounded-lg overflow-y-auto max-h-200">
              <h2 className="font-score text-lg font-bold text-gray-800">
                재료
              </h2>
              <ul className="py-2 flex flex-wrap">
                {ingredients.map((ingredient, index) => (
                  <ul
                    key={index}
                    className="font-score text-gray-600 mr-4 mb-2"
                  >
                    {ingredient}
                  </ul>
                ))}
              </ul>
              <h2 className="font-score text-lg font-bold text-gray-800 mt-4 ">
                레시피
              </h2>
              <ol
                className="list-decimal list-inside"
                style={{ listStyleType: 'none' }}
              >
                {steps.map((step, index) => (
                  <li key={index} className="font-score text-gray-600 pt-3">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>
      <footer className="fixed bottom-5 left-0 right-0 px-6 text-sm md:text-lg">
        <div
          className="mx-auto flex justify-between mb-4"
          style={{ maxWidth: '400px' }}
        >
          <button
            className="font-score transition ease-in-out bg-gray-400 hover:bg-gray-600 text-white font-bold py-3 px-9 rounded-full"
            onClick={() => navigate('/recipe/recommend')}
          >
            다시 할래요 👎🏿
          </button>
          <button
            className="font-score font-bold py-3 px-9 rounded-full transition ease-in-out bg-main hover:bg-emerald hover:cursor-pointer text-white hover:text-black"
            onClick={handleSaveButtonClick}
          >
            저장할꼬얌 💛
          </button>
        </div>
      </footer>
    </section>
  );
};

export default GptResult;
