export default function Home() {
  return (
    <p>
      <form method="post" action="/admin/logout">
        <button type="submit">Logout</button>
      </form>
    </p>
  );
}
