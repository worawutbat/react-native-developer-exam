import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useContext, useMemo } from 'react';
import { ILeaderBoard, LeaderBoardContext } from '@/provider/LeaderBoardProvider';

export default function TabTwoScreen() {
  const { leaderBoard } = useContext(LeaderBoardContext)
  const leaderBoardSorted = useMemo(() => (leaderBoard as ILeaderBoard)?.sort((a, b) => b.userScore - a.userScore),[leaderBoard])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leader Board</Text>
      <View style={{padding: 16}}>
        {leaderBoardSorted?.map(({userName, userScore}, index) => <Text key={`${index + 1}]-${userName}`} style={styles.title}>{`[#${index + 1}] ${userName}: ${userScore}`}</Text>)}
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  }
});
