import { Button, FlatList, SafeAreaView, StatusBar, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LeaderBoardContext } from '@/provider/LeaderBoardProvider';
import { questions as _questions } from '@/constants/QuestionsData';

interface IAnswer { 
  isCorrect: boolean; 
  label: string
}

interface IQuestion {
  question: string
  answers: IAnswer[]
}

interface IAnsweredItem {
  key: string; 
  isCorrect: boolean, 
  answerSelectedKey: string
}

interface IQuestionPresenter extends IQuestion {
  index: number;
  answerSelectedKey?: string;
  onClickAnswer: (answeredItem: IAnsweredItem) => void
}

const QuestionPresenter = (props: IQuestionPresenter) => {
  const {index, question, answers, onClickAnswer, answerSelectedKey} = props

  return (
    <View key={question} style={{padding: 16}}>
      <Text style={questionPresenterStyles.question}>{`${index}. ${question}`}</Text>
      {answers?.map(({isCorrect, label}, index) => {
        const key = `${question}-${index}`
        const isSelected = answerSelectedKey === key
        return (
          <Text key={key} style={[questionPresenterStyles.answer, ]} onPress={e => onClickAnswer({key: question, isCorrect, answerSelectedKey: key})}>
            <Text style={{ color: isSelected ? '#fff': 'black', fontSize: 20, backgroundColor: isSelected ? 'black': 'white', }}>{`${index + 1}). ${label}`}</Text> 
          </Text>
        )}
      )}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  )
}

interface ISubmitSectionPresenter {
  answeredCount: number
  userName: string
  onChangeUserName: React.Dispatch<React.SetStateAction<string>>
  onSubmitTest: () => void
}

const SubmitSectionPresenter = (props: ISubmitSectionPresenter) => {
  const { answeredCount, userName, onChangeUserName, onSubmitTest } = props;

  return (
    <View>
      <Text style={styles.title}>{`Answered: ${answeredCount}/20`}</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUserName}
        placeholder='Input Username...'
        placeholderTextColor="gray"
        value={userName}
      />
      <Button
        title="Submit Test"
        onPress={onSubmitTest}
      />
    </View>
  )
}

const questionPresenterStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  answer: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
});

  // use redux kept user info, user score and all score (or simple use context)
  // 1. input username (input form and remember user info and score)
  // 2. stake test question:answer 1:4 // whole questions count is 20
  // 2.1 if refresh or reopen => random new question and reorder answer
  // 2.2 implement how to calculate and sorted
  // 3 display score board

export default function TabOneScreen() {

  const { onAddNewScoreToBoard } = useContext(LeaderBoardContext)

  const [userName, onChangeUserName] = useState<string>('')
  const [questions, setQuestions] = useState(_questions)
  const [answerLists, setAnswerLists] = useState<IAnsweredItem[]>([])
  
  const userScore = useMemo(() => {
    return answerLists.filter(a => a.isCorrect).length
  }, [answerLists])

  useEffect(() => setQuestions(
    _questions
    .map((item) => ({...item, answers: item.answers.sort((a, b) => 0.5 - Math.random())}))
    .sort((a, b) => 0.5 - Math.random())
  ), [])

  const onClickAnswer = useCallback((props: IAnsweredItem) => {
    const {isCorrect, key, answerSelectedKey} = props

    const newArr = {key, isCorrect, answerSelectedKey}
    if (!answerLists.length) {
      setAnswerLists([newArr])
    } else if (!answerLists.find(a => a.key === key)) {
      setAnswerLists([...answerLists, newArr])
    } else {
      const _newAnsArr = answerLists.map(_a => {
        if (_a.key === key) {
          return (newArr)
        }
        else { 
          return _a
        }
      })
      setAnswerLists(_newAnsArr)
    }

  } ,[answerLists])

  const onSubmitTest = useCallback(() => {
    // send username and score to score board
    const user = { userName, userScore }
    onAddNewScoreToBoard(user)
    // clear data
    onChangeUserName('')
    setAnswerLists([])
  }, [userName, userScore])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{`Direction: Choose the best answer (Every application re-load or re-open will be random question and answer)`}</Text>
      <FlatList
          style={{ margin: 20 }}
          data={questions}
          renderItem={({item, index}) => 
            <QuestionPresenter 
              index={index+1}
              question={item.question} 
              answers={item.answers} 
              onClickAnswer={onClickAnswer} 
              answerSelectedKey={answerLists.find(_item => _item.key === item.question)?.answerSelectedKey}
              />
            }
        />
      <SubmitSectionPresenter userName={userName} onChangeUserName={onChangeUserName} onSubmitTest={onSubmitTest} answeredCount={answerLists.length || 0}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 24,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 24,
  },
});
