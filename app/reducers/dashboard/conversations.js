const initState = {
  isLoadMoreConversations: false,
  isLoadingConversations: true,
  conversations: [],
  pagingConversations: null,
  filteredConversations: []
}

const conversations = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_MORE_CONVERSATIONS':
      return {
        ...state,
        isLoadMoreConversations: action.state
      }
    case 'LOADING_CONVERSATIONS':
      return {
        ...state,
        isLoadingConversations: action.state
      }
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.conversations,
        pagingConversations: (action.pagingConversations) ? action.pagingConversations : null,
        isLoadMoreConversations: false
      }
    case 'COMPLETE_GET_CONVERSATIONS':
      return {
        ...state,
        pagingConversations: action.pagingConversations,
        conversations: action.conversations,
        isLoadingConversations: false,
        filteredConversations: action.conversations
      }
    case 'SET_FILTERED_CONVERSATIONS':
      return {
        ...state,
        filteredConversations: action.filteredConversations
      }
    default:
      return state;
  }
}

export default conversations;
