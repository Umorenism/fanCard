import StripeWrapper from "./component/FanRegistration"; // Make sure the path is correct

const App = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Fan Registration
        </h1>
        <StripeWrapper />
      </div>
    </div>
  );
};

export default App;
