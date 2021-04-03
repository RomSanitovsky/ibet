PointsFormatModel = {
    FinalMatchWinner = 3, // validate int > 0
    HalfTimeWinner = 1, // validate int > 0
    TotalPoints = 2, // validate int > 0
}

UserBetInfoModel = {
    FinalMatchWinner = -1, // validate
    HalfTimeWinner = -1, // validate
    TotalPoints = -1 // validate
}

ScoreMatchModel = {
    match_id: int, 
    userBetInfoModel: UserBetInfoModel
}

GroupData = [
    user_id = {
        points_total_now: int,
        bet_on_match: [UserBetMatch]  
    } 
]

Group = {
    id: str,
    name: str, // validate 2 chars or more with spaces
    token: str, // hash-something...
    league: League,
    pointsFormat: PointsFormatModel,
    users: List[User],
    groupData: GroupData,
    admin: User,
    status: Enum // Active, History

    // functions
    // def calc_user_total_points(groupData.user_id) = {
    //     total_points = 0
    //     foreach(obj in groupData.user_id) {
    //         match_info = get_match_info_by_id(obj.match_id) // get_match_info_by_id returns obj = { FinalMatchWinner, HalfTimeWinner, TotalPoints}
    //         if match_info.FinalMatchWinner - obj.bet_on_match.FinalMatchWinner == 0 {
    //             total_points += PointsFormatModel.FinalMatchWinner
    //         }

    //         if match_info.HalfTimeWinner - obj.bet_on_match.HalfTimeWinner == 0 {
    //             total_points += PointsFormatModel.HalfTimeWinner
    //         }

    //         if match_info.TotalPoints - obj.bet_on_match.TotalPoints == 0 {
    //             total_points += PointsFormatModel.TotalPoints
    //         }

    //     }
    // }

    // // add user
    // create group (include set points manager)
}


User = {
    id: str, // hash
    username: str, // validate username is 2 chars or more
    email: str, // validate email
    password: str, // validate password is 8 chars
    list_active_groups: List[Group],
    list_history_groups: List[Group]
}

League = {
    id: str, // hash
    name: str, 
    teams: List[Team],
    logo: Image
}

Team = {
    id: str, // hash
    name: str,
    remaining_games: int,
    wins: int,
    loses: int,
    logo: Image
}

Fixture = {
    id: str, // hash
    home: Team,
    away: Team
}
