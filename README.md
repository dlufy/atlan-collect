# atlan-collect

this Action service. upon receiving the response for a form from user, we are pushing it to the topic `user_response` . 
all of the different use are connect to this topic with different channel to serve different usecase
e.g. channel : `append_to_gs`, is handling the creating and appending data to the google sheet for the form submission, in the same way we can add more
channel to servie more usecases(plug and play).
