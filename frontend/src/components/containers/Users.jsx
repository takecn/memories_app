import React, { memo, useReducer, useEffect, useState } from "react";
import { Alert, Button } from "@mui/material";
import { fetchUsersIndex, postUser, putUser, deleteUser } from "../../apis/users";
import { REQUEST_STATE } from "../../constants";
import { initialUsersState, usersActionTypes, usersReducer } from "../../reducers/users";
import { UsersIndex } from '../presentations/UsersIndex.jsx';
import { UserCreateDialog } from '../presentations/UserCreateDialog.jsx';
import { UserDialog } from '../presentations/UserDialog.jsx';
import { UserEditDialog } from '../presentations/UserEditDialog.jsx';
import { DeleteDialog } from '../presentations/DeleteDialog.jsx';
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Users = memo(() => {
  const [usersState, dispatch] = useReducer(usersReducer, initialUsersState);
  const [state, setState] = useState({
    isOpenUserCreateDialog: false,
    isOpenUserDialog: false,
    isOpenUserEditDialog: false,
    isOpenUserDeleteDialog: false,
    selectedUser: null,
    message: null,
  });
  const [errors, setErrors] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState();
  const [isUserAdmin, setIsUserAdmin] = useState();
  const [isUserGuest, setIsUserGuest] = useState();
  const [userProfile, setUserProfile] = useState();
  const [userAvatar, setUserAvatar] = useState();
  const [preview, setPreview] = useState();

  // ユーザー情報をサーバーサイドから取得する．
  const fetchUserList = () => {
    dispatch({ type: usersActionTypes.FETCHING });
    fetchUsersIndex()
    .then((data) =>
      dispatch({
        type: usersActionTypes.FETCH_SUCCESS,
        payload: { users: data.users },
      })
    );
  };

  // ユーザーのstateが更新されるたびにユーザー一覧ページをレンダリングする．
  useEffect(fetchUserList, [state.selectedUser]);

  // ユーザー編集モーダルで選択した画像のアバタープレビューを表示する．
  const previewUserAvatar = (e) => {
    const file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file))
  };

  const createFormData = () => {
    const formData = new FormData();
    // user_nameとemailのみ，nullを送信する．presenceバリデーションエラーを表示するため．
    // undefinedは送信しない．データが"undefined"に更新されてしまうため．
    if (userName !== undefined) formData.append("user_name", userName);
    if (userEmail !== undefined) formData.append("email", userEmail);
    if (userPassword !== undefined) formData.append("password", userPassword);
    if (userPasswordConfirmation !== undefined) formData.append("password_confirmation", userPasswordConfirmation);
    // 上記以外は，編集された場合のみFormDataに格納する．
    if (isUserAdmin) formData.append("admin", isUserAdmin);
    if (isUserGuest) formData.append("guest", isUserGuest);
    if (userProfile) formData.append("user_profile", userProfile);
    if (userAvatar) formData.append("user_avatar", userAvatar);
    return formData
  };

  const userCreate = () => {
    const formData = createFormData();

    // ユーザー登録情報をサーバーサイドに送る．
    postUser({formData})
    .then((data) => {
      // userが登録された場合，登録内容を反映する．
      if (data.user) {
        setState({
          ...state,
          isOpenUserDialog: true,
          isOpenUserCreateDialog: false,
          selectedUser: data.user,
          message: data.message,
        })
        setErrors()
        setUserName()
        setUserEmail()
        setUserPassword()
        setUserPasswordConfirmation()
        setIsUserAdmin()
        setIsUserGuest()
        setUserProfile()
        setUserAvatar()
        setPreview()
      } else {
        // userが登録されていない場合，エラーメッセージをセットする．
        setErrors(data.error_messages)
      }
    })
  };

  const userUpdate = () => {
    // 各種state内いずれかが変更されたときのみ，FormDataを送信する（未変更を示すundefinedを弾く）．
    if (userName !== undefined ||
      userEmail !== undefined ||
      isUserAdmin !== undefined ||
      isUserGuest !== undefined ||
      userProfile !== undefined ||
      userAvatar !== undefined) {

      const formData = createFormData();

      // ユーザー編集情報をサーバーサイドに送る．
      putUser({
        userId: state.selectedUser.id,
        formData,
      }).then((data) => {
        // userが更新された場合，更新内容を反映する．
        if (data.user) {
          setState({
            ...state,
            isOpenUserDialog: true,
            isOpenUserEditDialog: false,
            selectedUser: data.user,
            message: data.message,
          })
          setErrors()
          setUserName()
          setUserEmail()
          setIsUserAdmin()
          setIsUserGuest()
          setUserProfile()
          setUserAvatar()
          setPreview()
        } else {
          // userが更新されていない場合，エラーメッセージをセットする．
          setErrors(data.error_messages)
        }
      })
    }
  };

  const userDelete = () => {
    deleteUser({userId: state.selectedUser.id})
    .then((data) => {
      setState({
        ...state,
        isOpenUserDialog: false,
        isOpenUserDeleteDialog: false,
        selectedUser: null,
        message: data.message,
      })
    })
  };

  return (
    <>
      {/* ユーザー一覧 */}
      {
        usersState.fetchState === REQUEST_STATE.LOADING ?
          <CircularIndeterminate />
        :
        <>
          {state.message &&
            <Alert severity="success">{state.message}</Alert>
          }
          <Button
            variant="outlined"
            onClick={() =>
              setState({
                ...state,
                isOpenUserCreateDialog: true,
              })
            }
          >
            ユーザー登録する
          </Button>
          {usersState.userList.map((user) =>
            <div key={user.id}>
              <UsersIndex
                user={user}
                onClickUser={() =>
                  setState({
                    ...state,
                    isOpenUserDialog: true,
                    selectedUser: user,
                    message: null,
                  })
                }
              />
            </div>
          )}
        </>
      }

      {/* ユーザー登録モーダル */}
      {
        state.isOpenUserCreateDialog &&
        <UserCreateDialog
          isOpen={state.isOpenUserCreateDialog}
          preview={preview}
          errors={errors}
          onClose={() => {
            setState({
              ...state,
              isOpenUserCreateDialog: false,
            })
            // 編集を確定せずに閉じた場合は，各種stateを空にする．
            setErrors()
            setUserName()
            setUserEmail()
            setUserPassword()
            setUserPasswordConfirmation()
            setIsUserAdmin()
            setIsUserGuest()
            setUserProfile()
            setUserAvatar()
            setPreview()
            }
          }
          onChangeUserName={(e) => setUserName(e.target.value)}
          onChangeUserEmail={(e) => setUserEmail(e.target.value)}
          onChangeUserPassword={(e) => setUserPassword(e.target.value)}
          onChangeUserPasswordConfirmation={(e) => setUserPasswordConfirmation(e.target.value)}
          onChangeUserAdmin={(e) => setIsUserAdmin(e.target.value)}
          onChangeUserGuest={(e) => setIsUserGuest(e.target.value)}
          onChangeUserProfile={(e) => setUserProfile(e.target.value)}
          onChangeUserAvatar={(e) => {
            setUserAvatar(e.target.files[0])
            previewUserAvatar(e)
          }}
          onClick={userCreate}
        />
      }

      {/* ユーザー詳細モーダル */}
      {
        state.isOpenUserDialog &&
        <UserDialog
          isOpen={state.isOpenUserDialog}
          user={state.selectedUser}
          message={state.message}
          onClose={() =>
            setState({
              ...state,
              isOpenUserDialog: false,
              message: null,
            })
          }
          onClickUserEdit={() =>
            setState({
              ...state,
              isOpenUserEditDialog: true,
            })
          }
          onClickUserDelete={() =>
            setState({
              ...state,
              isOpenUserDeleteDialog: true,
            })
          }
        />
      }

      {/* ユーザー編集モーダル */}
      {
        state.isOpenUserEditDialog &&
        <UserEditDialog
          isOpen={state.isOpenUserEditDialog}
          user={state.selectedUser}
          preview={preview}
          errors={errors}
          onClose={() => {
            setState({
              ...state,
              isOpenUserDialog: true,
              isOpenUserEditDialog: false,
            })
            // 編集を確定せずに閉じた場合は，各種stateを空にする．
            setErrors()
            setUserName()
            setUserEmail()
            setIsUserAdmin()
            setIsUserGuest()
            setUserProfile()
            setUserAvatar()
            setPreview()
            }
          }
          onChangeUserName={(e) => setUserName(e.target.value)}
          onChangeUserEmail={(e) => setUserEmail(e.target.value)}
          onChangeUserAdmin={(e) => setIsUserAdmin(e.target.value)}
          onChangeUserGuest={(e) => setIsUserGuest(e.target.value)}
          onChangeUserProfile={(e) => setUserProfile(e.target.value)}
          onChangeUserAvatar={(e) => {
            setUserAvatar(e.target.files[0])
            previewUserAvatar(e)
          }}
          onClick={userUpdate}
        />
      }

      {/* ユーザー削除モーダル */}
      {
        state.isOpenUserDeleteDialog &&
        <DeleteDialog
          isOpen={state.isOpenUserDeleteDialog}
          user={state.selectedUser}
          onClose={() =>
            setState({
              ...state,
              isOpenUserDialog: true,
              isOpenUserDeleteDialog: false,
            })
          }
          onClickDelete={userDelete}
          onClickCloseDelete={() =>
            setState({
              ...state,
              isOpenUserDialog: true,
              isOpenUserDeleteDialog: false,
            })
          }
        />
      }
    </>
  );
});
