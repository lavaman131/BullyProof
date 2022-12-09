import sqlite3

con = sqlite3.connect("database.db")
cur = con.cursor()


def get_user_token(user_id):
    sql = f'SELECT token FROM token where user_id="{user_id}"'
    res = cur.execute(sql)
    result = res.fetchone()
    if result == None:
        return {"data": {}, "status": 500, "message": "user does not exist"}
    return {
        "data": {"token": result[0]},
        "status": 200,
        "message": "returned token safely",
    }


def get_user_twitter_user_id(user_id):
    sql = f'SELECT twitter_user_id FROM token where user_id="{user_id}"'
    res = cur.execute(sql)
    result = res.fetchone()
    if result == None:
        return {"data": {}, "status": 500, "message": "user does not exist"}
    return {
        "data": {"twitter_user_id": result[0]},
        "status": 200,
        "message": "returned twitter_user_id safely",
    }


def create_user(user_id):
    try:
        sql = f'INSERT INTO token VALUES("{user_id}", NULL, NULL)'
        cur.execute(sql)
        con.commit()
        return {"data": {}, "status": 200, "message": "success create user"}
    except Exception as e:
        return {"data": {}, "status": 500, "message": f"error in creating user:\n{e}"}


def update_user(user_id, twitter_user_id, token):
    try:
        sql = f'UPDATE token SET token="{token}", twitter_user_id="{twitter_user_id}" WHERE user_id="{user_id}"'
        cur.execute(sql)
        con.commit()
    except Exception as e:
        return {"data": {}, "status": 500, "message": f"error in updating user:\n{e}"}


print(get_user_twitter_user_id("123"))
