import Head from "next/head";
import styles from './styles/layout.module.scss';

const Timeline: React.FunctionComponent<string> = (endpoint: string) => {

  const isPublic = endpoint === "public_timelines"
  const isUser = endpoint === "user_timeline"

  const profileUser = {
      username: '123',
      user_id: "123"
    };

  const g = {user: {
      username: '123',
      user_id: "123"
    }};

  const followed = false

  return (

    <>
    <Head>
      <title>{isPublic ? "Public Timeline" : isUser ? profileUser.username + "'s Timeline" : "My timeline"}</title>
    </Head>

    <h2>{isPublic ? "Public Timeline" : isUser ? profileUser.username + "'s Timeline" : "My timeline"}</h2>

    

    {g.user && (
      
      endpoint === 'user_timeline' ? (
        
        <div className={styles.followstatus}>

          {g.user.user_id === profileUser.user_id ? "This is you!" : followed ? (
            "You are currently following this user."
            ) : <></>
          }
        </div>






      ) : <></>

    )}

  </>


  {% if g.user %}
    {% if request.endpoint == 'user_timeline' %}
      <div className={styles.followstatus}>
      {% if g.user.user_id == profile_user.user_id %}
        This is you!
      {% elif followed %}
        You are currently following this user.
        <a class=unfollow href="{{ url_for('unfollow_user', username=profile_user.username)
          }}">Unfollow user</a>.
      {% else %}
        You are not yet following this user.
        <a class=follow href="{{ url_for('follow_user', username=profile_user.username)
          }}">Follow user</a>.
      {% endif %}
      </div>
    {% elif request.endpoint == 'timeline' %}
      <div class=twitbox>
        <h3>What's on your mind {{ g.user.username }}?</h3>
        <form action="{{ url_for('add_message') }}" method=post>
          <p><input type=text name=text size=60><!--
          --><input type=submit value="Share">
        </form>
      </div>
    {% endif %}
  {% endif %}
  <ul class=messages>
  {% for message in messages %}
    <li><img src="{{ message.email|gravatar(size=48) }}"><p>
      <strong><a href="{{ url_for('user_timeline', username=message.username)
      }}">{{ message.username }}</a></strong>
      {{ message.text }}
      <small>&mdash; {{ message.pub_date|datetimeformat }}</small>
  {% else %}
    <li><em>There's no message so far.</em>
  {% endfor %}
  </ul>
{% endblock %}
  );
};

export default Timeline;
