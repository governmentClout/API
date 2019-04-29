const handlers = require('./handlers');

/**
ROUTES
*/

let router = {
	'users' : handlers.users,
	'login' : handlers.login,
	'profiles' : handlers.profiles,
	'posts' : handlers.posts,
	'comments' : handlers.comments,
	'reactions' : handlers.reactions,
	'shares' : handlers.shares,
	'views': handlers.views,
	'friends': handlers.friends,
	'executives':handlers.executives,
	'trends':handlers.trends,
	'tests':handlers.tests,
	'articles': handlers.articles,
	'polls': handlers.polls,
	'petitions':handlers.petitions,
	'signatures':handlers.signatures,
	'settings':handlers.settings,
	'admins':handlers.admin,
	'resets':handlers.resets,
	'messages':handlers.messages,
	'friendrequests':handlers.friendrequests,
	'sendmessages':handlers.sendmessages,
	'receivemessages':handlers.receivemessages,
	'replymessages':handlers.replymessages,
	'states':handlers.states,
	'lga':handlers.lga
};

module.exports = router;
